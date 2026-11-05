package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"net/mail"
	"os"
	"os/signal"
	"strings"
	"syscall"

	betterauthadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/betterauth"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/cli"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/config"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
	userprofileservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile/service"
	"github.com/manifoldco/promptui"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	authUserID := flag.String("auth-user-id", "", "existing BetterAuth user ID to grant platform admin access")
	email := flag.String("email", "", "email for a new BetterAuth identity")
	firstName := flag.String("first-name", "", "API user's first name")
	lastName := flag.String("last-name", "", "API user's last name")
	passwordStdin := flag.Bool("password-stdin", false, "read password and confirmation from two stdin lines")
	yes := flag.Bool("yes", false, "confirm a flag-driven provisioning request")
	flag.Parse()

	interactive := flag.NFlag() == 0 && flag.NArg() == 0
	var input application.PlatformAdminInput
	var err error
	if interactive {
		input, err = promptPlatformAdmin()
	} else {
		if flag.NArg() != 0 {
			return fmt.Errorf("unexpected positional arguments")
		}
		if !*yes {
			return fmt.Errorf("flag-driven provisioning requires --yes")
		}
		input, err = platformAdminInputFromFlags(*authUserID, *email, *firstName, *lastName, *passwordStdin)
	}
	if err != nil {
		return err
	}
	defer func() {
		input.Password = ""
		input.ConfirmPassword = ""
	}()

	if interactive {
		if err := confirmPlatformAdmin(input); errors.Is(err, promptui.ErrAbort) {
			fmt.Println("Cancelled; no changes made.")
			return nil
		} else if err != nil {
			return err
		}
	}

	databaseURL, err := config.LoadDatabaseURL()
	if err != nil {
		return err
	}
	store, err := postgres.New(databaseURL)
	if err != nil {
		return fmt.Errorf("configure API database: %w", err)
	}
	defer store.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if err := store.Ping(ctx); err != nil {
		return fmt.Errorf("connect to API database: %w", err)
	}

	var identityProvisioner application.AuthIdentityProvisioner
	if input.AuthUserID == "" {
		authConfig, err := config.LoadAuthServiceConfig()
		if err != nil {
			return err
		}
		identityProvisioner = betterauthadapter.NewClient(authConfig.BaseURL, authConfig.ServiceToken)
	}

	users := userservice.NewService(
		store.UserRepository(),
		userprofileservice.NewService(store.UserProfileRepository()),
		store,
	)
	creator := application.NewPlatformAdminCreator(identityProvisioner, users)
	created, err := creator.Create(ctx, input)
	input.Password = ""
	input.ConfirmPassword = ""
	if err != nil {
		return err
	}

	if created.AuthUserID == nil || strings.TrimSpace(*created.AuthUserID) == "" {
		return fmt.Errorf("API user was created without an Auth user ID")
	}
	fullName := strings.TrimSpace(strings.Join([]string{*input.FirstName, *input.LastName}, " "))
	fmt.Println(cli.FormatPlatformAdminSuccess(fullName, input.Email))
	return nil
}

func promptPlatformAdmin() (application.PlatformAdminInput, error) {
	_, choice, err := (&promptui.Select{
		Label: "Platform admin setup",
		Items: []string{"Create a new Auth identity", "Link an existing Auth identity"},
	}).Run()
	if err != nil {
		return application.PlatformAdminInput{}, err
	}

	switch choice {
	case "Link an existing Auth identity":
		authUserID, err := promptRequired("BetterAuth user ID")
		if err != nil {
			return application.PlatformAdminInput{}, err
		}
		firstName, err := promptOptional("First name (optional)")
		if err != nil {
			return application.PlatformAdminInput{}, err
		}
		lastName, err := promptOptional("Last name (optional)")
		if err != nil {
			return application.PlatformAdminInput{}, err
		}
		return application.PlatformAdminInput{
			AuthUserID: strings.TrimSpace(authUserID),
			FirstName:  optional(&firstName),
			LastName:   optional(&lastName),
		}, nil
	case "Create a new Auth identity":
	default:
		return application.PlatformAdminInput{}, fmt.Errorf("unexpected platform admin setup choice")
	}

	email, err := promptValue("Email", validateEmail)
	if err != nil {
		return application.PlatformAdminInput{}, err
	}
	firstName, err := promptRequired("First name")
	if err != nil {
		return application.PlatformAdminInput{}, err
	}
	lastName, err := promptOptional("Last name (optional)")
	if err != nil {
		return application.PlatformAdminInput{}, err
	}
	password, err := promptPassword("Password", nil)
	if err != nil {
		return application.PlatformAdminInput{}, err
	}
	confirmation, err := promptPassword("Confirm password", func(value string) error {
		return application.ValidatePasswordConfirmation(password, value)
	})
	if err != nil {
		return application.PlatformAdminInput{}, err
	}

	firstName = strings.TrimSpace(firstName)
	lastName = strings.TrimSpace(lastName)
	return application.PlatformAdminInput{
		Email:           strings.TrimSpace(email),
		AuthName:        strings.TrimSpace(strings.Join([]string{firstName, lastName}, " ")),
		Password:        password,
		ConfirmPassword: confirmation,
		FirstName:       optional(&firstName),
		LastName:        optional(&lastName),
	}, nil
}

func platformAdminInputFromFlags(authUserID, email, firstName, lastName string, passwordStdin bool) (application.PlatformAdminInput, error) {
	authUserID = strings.TrimSpace(authUserID)
	if authUserID != "" {
		if email != "" || passwordStdin {
			return application.PlatformAdminInput{}, fmt.Errorf("--auth-user-id cannot be combined with --email or --password-stdin")
		}
		return application.PlatformAdminInput{
			AuthUserID: authUserID,
			FirstName:  optional(&firstName),
			LastName:   optional(&lastName),
		}, nil
	}

	email = strings.TrimSpace(email)
	firstName = strings.TrimSpace(firstName)
	lastName = strings.TrimSpace(lastName)
	if !passwordStdin || email == "" || (firstName == "" && lastName == "") || !validEmail(email) {
		return application.PlatformAdminInput{}, fmt.Errorf("provide a valid --email, a first or last name, and --password-stdin, or use --auth-user-id")
	}
	if input, err := os.Stdin.Stat(); err != nil {
		return application.PlatformAdminInput{}, fmt.Errorf("check password input: %w", err)
	} else if input.Mode()&os.ModeCharDevice != 0 {
		return application.PlatformAdminInput{}, fmt.Errorf("password stdin must be piped from a protected source; terminal input is not hidden")
	}
	password, confirmation, err := cli.ReadPasswordConfirmation(os.Stdin)
	if err != nil {
		return application.PlatformAdminInput{}, err
	}
	if err := application.ValidatePasswordConfirmation(password, confirmation); err != nil {
		return application.PlatformAdminInput{}, err
	}
	return application.PlatformAdminInput{
		Email:           email,
		AuthName:        strings.TrimSpace(strings.Join([]string{firstName, lastName}, " ")),
		Password:        password,
		ConfirmPassword: confirmation,
		FirstName:       optional(&firstName),
		LastName:        optional(&lastName),
	}, nil
}

func promptRequired(label string) (string, error) {
	return promptValue(label, func(value string) error {
		if strings.TrimSpace(value) == "" {
			return fmt.Errorf("this field is required")
		}
		return nil
	})
}

func promptOptional(label string) (string, error) {
	return (&promptui.Prompt{Label: label}).Run()
}

func promptValue(label string, validate func(string) error) (string, error) {
	value, err := (&promptui.Prompt{Label: label, Validate: validate}).Run()
	if err != nil {
		return "", fmt.Errorf("%s prompt: %w", label, err)
	}
	return value, nil
}

func promptPassword(label string, validate func(string) error) (string, error) {
	if validate == nil {
		validate = func(value string) error {
			if value == "" {
				return fmt.Errorf("password is required")
			}
			return nil
		}
	}
	value, err := (&promptui.Prompt{
		Label:       label,
		Mask:        '*',
		HideEntered: true,
		Validate:    validate,
	}).Run()
	if err != nil {
		return "", fmt.Errorf("%s prompt: %w", label, err)
	}
	return value, nil
}

func confirmPlatformAdmin(input application.PlatformAdminInput) error {
	target := input.Email
	if input.AuthUserID != "" {
		target = fmt.Sprintf("Auth user %s", input.AuthUserID)
	}
	_, err := (&promptui.Prompt{
		Label:     fmt.Sprintf("Create platform admin for %s", target),
		IsConfirm: true,
	}).Run()
	return err
}

func validateEmail(value string) error {
	if !validEmail(strings.TrimSpace(value)) {
		return fmt.Errorf("enter a valid email address")
	}
	return nil
}

func validEmail(value string) bool {
	address, err := mail.ParseAddress(value)
	return err == nil && address.Address == value
}

func optional(value *string) *string {
	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}
