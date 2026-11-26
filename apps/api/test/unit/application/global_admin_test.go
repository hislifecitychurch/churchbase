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

type fakeGlobalAdminUserCreator struct {
	calls   int
	input   userdomain.CreateInput
	profile userprofile.Details
	result  userdomain.User
	err     error
}

func (c *fakeGlobalAdminUserCreator) CreateGlobalAdmin(_ context.Context, input userdomain.CreateInput, profile userprofile.Details) (userdomain.User, error) {
	c.calls++
	c.input = input
	c.profile = profile
	return c.result, c.err
}

func TestGlobalAdminCreatorCreatesIdentityAndAPIUser(t *testing.T) {
	authUserID := "auth-user-1"
	role := userdomain.GlobalRoleAdmin
	identity := &fakeIdentityProvisioner{userID: authUserID}
	users := &fakeGlobalAdminUserCreator{result: userdomain.User{
		ID:          uuid.New(),
		AuthUserID:  &authUserID,
		GlobalRoles: &role,
	}}
	creator := application.NewGlobalAdminCreator(identity, users)

	created, err := creator.Create(context.Background(), application.GlobalAdminInput{
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
	if created.GlobalRoles == nil || *created.GlobalRoles != userdomain.GlobalRoleAdmin {
		t.Fatalf("created global role = %v, want admin", created.GlobalRoles)
	}
}

func TestGlobalAdminCreatorReportsAuthIDWhenAPIUserCreationFails(t *testing.T) {
	identity := &fakeIdentityProvisioner{userID: "auth-user-1"}
	users := &fakeGlobalAdminUserCreator{err: errors.New("database unavailable")}
	creator := application.NewGlobalAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.GlobalAdminInput{
		Email:           "admin@example.org",
		AuthName:        "Ada Lovelace",
		Password:        "strong-password",
		ConfirmPassword: "strong-password",
	})
	if err == nil || !strings.Contains(err.Error(), "--auth-user-id=auth-user-1") || !errors.Is(err, users.err) {
		t.Fatalf("Create error = %v, want retryable partial-provisioning error", err)
	}
}

func TestGlobalAdminCreatorRejectsMissingPassword(t *testing.T) {
	identity := &fakeIdentityProvisioner{userID: "auth-user-1"}
	users := &fakeGlobalAdminUserCreator{}
	creator := application.NewGlobalAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.GlobalAdminInput{
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

func TestGlobalAdminCreatorRejectsMismatchedPassword(t *testing.T) {
	identity := &fakeIdentityProvisioner{userID: "auth-user-1"}
	users := &fakeGlobalAdminUserCreator{}
	creator := application.NewGlobalAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.GlobalAdminInput{
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

func TestGlobalAdminCreatorRejectsEmptyAuthID(t *testing.T) {
	identity := &fakeIdentityProvisioner{}
	users := &fakeGlobalAdminUserCreator{}
	creator := application.NewGlobalAdminCreator(identity, users)

	_, err := creator.Create(context.Background(), application.GlobalAdminInput{
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

func TestGlobalAdminCreatorUsesExistingIdentity(t *testing.T) {
	authUserID := "existing-auth-user"
	users := &fakeGlobalAdminUserCreator{result: userdomain.User{AuthUserID: &authUserID}}
	creator := application.NewGlobalAdminCreator(nil, users)

	created, err := creator.Create(context.Background(), application.GlobalAdminInput{AuthUserID: authUserID})
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
