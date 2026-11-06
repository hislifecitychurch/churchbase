package application

import (
	"context"
	"errors"
	"fmt"
	"strings"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

type AuthIdentityProvisioner interface {
	CreateUser(ctx context.Context, email, name, password string) (string, error)
}

type PlatformAdminUserCreator interface {
	CreatePlatformAdmin(ctx context.Context, input userdomain.CreateInput, profile userprofile.Details) (userdomain.User, error)
}

type PlatformAdminInput struct {
	AuthUserID      string
	Email           string
	AuthName        string
	Password        string
	ConfirmPassword string
	FirstName       *string
	LastName        *string
}

type PlatformAdminCreator struct {
	identities AuthIdentityProvisioner
	users      PlatformAdminUserCreator
}

func NewPlatformAdminCreator(identities AuthIdentityProvisioner, users PlatformAdminUserCreator) *PlatformAdminCreator {
	return &PlatformAdminCreator{identities: identities, users: users}
}

func ValidatePasswordConfirmation(password, confirmation string) error {
	if password == "" || confirmation == "" {
		return errors.New("password and confirmation are required")
	}
	if password != confirmation {
		return errors.New("password confirmation does not match")
	}
	return nil
}

func (c *PlatformAdminCreator) Create(ctx context.Context, input PlatformAdminInput) (userdomain.User, error) {
	authUserID := strings.TrimSpace(input.AuthUserID)
	createdAuthIdentity := false
	if authUserID == "" {
		if err := ValidatePasswordConfirmation(input.Password, input.ConfirmPassword); err != nil {
			return userdomain.User{}, err
		}
		if c.identities == nil {
			return userdomain.User{}, fmt.Errorf("Auth identity provisioner is required when no Auth user ID is supplied")
		}
		var err error
		authUserID, err = c.identities.CreateUser(ctx, input.Email, input.AuthName, input.Password)
		if err != nil {
			return userdomain.User{}, err
		}
		authUserID = strings.TrimSpace(authUserID)
		if authUserID == "" {
			return userdomain.User{}, fmt.Errorf("Auth identity provisioner returned an empty user ID")
		}
		createdAuthIdentity = true
	}

	created, err := c.users.CreatePlatformAdmin(
		ctx,
		userdomain.CreateInput{AuthUserID: &authUserID},
		userprofile.Details{FirstName: input.FirstName, LastName: input.LastName},
	)
	// shortcut: Auth and API writes are not atomic; retry API failures with the returned ID, add idempotent recovery if Auth timeouts must self-heal.
	if err != nil && createdAuthIdentity {
		return userdomain.User{}, fmt.Errorf("Auth identity %q was created, but API platform admin creation failed: %w; retry with --auth-user-id=%s", authUserID, err, authUserID)
	}
	return created, err
}
