package application_test

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

type fakeIdentityProvisioner struct {
	calls    int
	email    string
	name     string
	password string
	userID   string
}

func (p *fakeIdentityProvisioner) CreateUser(_ context.Context, email, name, password string) (string, error) {
	p.calls++
	p.email = email
	p.name = name
	p.password = password
	return p.userID, nil
}

type fakePlatformAdminUserCreator struct {
	calls   int
	input   userdomain.CreateInput
	profile userprofile.Details
	result  userdomain.User
	err     error
}

func (c *fakePlatformAdminUserCreator) CreatePlatformAdmin(_ context.Context, input userdomain.CreateInput, profile userprofile.Details) (userdomain.User, error) {
	c.calls++
	c.input = input
	c.profile = profile
	return c.result, c.err
}

func TestPlatformAdminCreatorCreatesIdentityAndAPIUser(t *testing.T) {
	authUserID := "auth-user-1"
	role := userdomain.PlatformRoleAdmin
	identity := &fakeIdentityProvisioner{userID: authUserID}
	users := &fakePlatformAdminUserCreator{result: userdomain.User{
		ID:           uuid.New(),
		AuthUserID:   &authUserID,
		PlatformRole: &role,
	}}
	creator := application.NewPlatformAdminCreator(identity, users)

	created, err := creator.Create(context.Background(), application.PlatformAdminInput{
		Email:           "admin@example.org",
		AuthName:        "Ada Lovelace",
		Password:        "strong-password",
		ConfirmPassword: "strong-password",
		FirstName:       stringPointer("Ada"),
		LastName:        stringPointer("Lovelace"),
	})
	if err != nil {
		t.Fatal(err)
	}
	if identity.calls != 1 || identity.email != "admin@example.org" || identity.name != "Ada Lovelace" || identity.password != "strong-password" {
		t.Fatalf("Auth provisioner calls/input = %d/%+v, want one matching call", identity.calls, identity)
	}
	if users.calls != 1 || users.input.AuthUserID == nil || *users.input.AuthUserID != authUserID {
		t.Fatalf("API user creation calls/input = %d/%+v", users.calls, users.input)
	}
	if users.profile.FirstName == nil || *users.profile.FirstName != "Ada" || users.profile.LastName == nil || *users.profile.LastName != "Lovelace" {
		t.Fatalf("profile details = %+v, want Ada Lovelace", users.profile)
	}
	if created.PlatformRole == nil || *created.PlatformRole != userdomain.PlatformRoleAdmin {
		t.Fatalf("created platform role = %v, want admin", created.PlatformRole)
	}
}

func TestPlatformAdminCreatorReportsAuthIDWhenAPIUserCreationFails(t *testing.T) {
	identity := &fakeIdentityProvisioner{userID: "auth-user-1"}
	users := &fakePlatformAdminUserCreator{err: errors.New("database unavailable")}
	creator := application.NewPlatformAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.PlatformAdminInput{
		Email:           "admin@example.org",
		AuthName:        "Ada Lovelace",
		Password:        "strong-password",
		ConfirmPassword: "strong-password",
	})
	if err == nil || !strings.Contains(err.Error(), "--auth-user-id=auth-user-1") || !errors.Is(err, users.err) {
		t.Fatalf("Create error = %v, want retryable partial-provisioning error", err)
	}
}

func TestPlatformAdminCreatorRejectsMissingPassword(t *testing.T) {
	identity := &fakeIdentityProvisioner{userID: "auth-user-1"}
	users := &fakePlatformAdminUserCreator{}
	creator := application.NewPlatformAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.PlatformAdminInput{
		Email:    "admin@example.org",
		AuthName: "Ada Lovelace",
	})
	if err == nil || !strings.Contains(err.Error(), "password and confirmation are required") {
		t.Fatalf("Create error = %v, want missing password error", err)
	}
	if identity.calls != 0 || users.calls != 0 {
		t.Fatalf("missing password still caused side effects: Auth=%d API=%d", identity.calls, users.calls)
	}
}

func TestPlatformAdminCreatorRejectsMismatchedPassword(t *testing.T) {
	identity := &fakeIdentityProvisioner{userID: "auth-user-1"}
	users := &fakePlatformAdminUserCreator{}
	creator := application.NewPlatformAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.PlatformAdminInput{
		Email:           "admin@example.org",
		AuthName:        "Ada Lovelace",
		Password:        "strong-password",
		ConfirmPassword: "different-password",
	})
	if err == nil || !strings.Contains(err.Error(), "password confirmation does not match") {
		t.Fatalf("Create error = %v, want password mismatch error", err)
	}
	if identity.calls != 0 || users.calls != 0 {
		t.Fatalf("password mismatch still caused side effects: Auth=%d API=%d", identity.calls, users.calls)
	}
}

func TestPlatformAdminCreatorRejectsEmptyAuthID(t *testing.T) {
	identity := &fakeIdentityProvisioner{}
	users := &fakePlatformAdminUserCreator{}
	creator := application.NewPlatformAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.PlatformAdminInput{
		Email:           "admin@example.org",
		AuthName:        "Ada Lovelace",
		Password:        "strong-password",
		ConfirmPassword: "strong-password",
	})
	if err == nil || !strings.Contains(err.Error(), "empty user ID") {
		t.Fatalf("Create error = %v, want empty Auth ID error", err)
	}
	if users.calls != 0 {
		t.Fatal("API user creation called without a valid Auth ID")
	}
}

func TestPlatformAdminCreatorUsesExistingIdentity(t *testing.T) {
	authUserID := "existing-auth-user"
	users := &fakePlatformAdminUserCreator{result: userdomain.User{AuthUserID: &authUserID}}
	creator := application.NewPlatformAdminCreator(nil, users)

	created, err := creator.Create(context.Background(), application.PlatformAdminInput{AuthUserID: authUserID})
	if err != nil {
		t.Fatal(err)
	}
	if users.calls != 1 || users.input.AuthUserID == nil || *users.input.AuthUserID != authUserID || created.AuthUserID == nil {
		t.Fatalf("existing identity was not used: calls=%d input=%+v created=%+v", users.calls, users.input, created)
	}
}

func stringPointer(value string) *string {
	return &value
}
