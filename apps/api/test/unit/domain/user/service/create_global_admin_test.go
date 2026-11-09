package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func TestServiceCreateGlobalAdmin(t *testing.T) {
	authUserID := "auth-user-1"
	globalRole := userdomain.GlobalRoleAdmin
	expected := userdomain.User{
		ID:          uuid.New(),
		AuthUserID:  &authUserID,
		GlobalRoles: &globalRole,
	}
	firstName, lastName := "Ada", "Lovelace"
	calls := []string{}
	repository := &fakeRepository{result: expected, calls: &calls}
	profiles := &fakeProfileCreator{calls: &calls}
	transactions := &fakeTransactionRunner{}
	service := userservice.NewService(repository, profiles, transactions)

	created, err := service.CreateGlobalAdmin(
		context.Background(),
		userdomain.CreateInput{AuthUserID: &authUserID},
		userprofile.Details{FirstName: &firstName, LastName: &lastName},
	)
	if err != nil {
		t.Fatal(err)
	}
	if !repository.globalAdminCalled || repository.called {
		t.Fatalf("repository calls = (create: %t, create global admin: %t), want (false, true)", repository.called, repository.globalAdminCalled)
	}
	if repository.input.AuthUserID == nil || *repository.input.AuthUserID != authUserID {
		t.Fatalf("repository AuthUserID = %v, want %q", repository.input.AuthUserID, authUserID)
	}
	if created.ID != expected.ID || created.GlobalRoles == nil || *created.GlobalRoles != userdomain.GlobalRoleAdmin {
		t.Fatalf("created user = %+v, want global admin with ID %s", created, expected.ID)
	}
	if !profiles.called || profiles.input.UserID != expected.ID || profiles.input.FirstName == nil || *profiles.input.FirstName != firstName || profiles.input.LastName == nil || *profiles.input.LastName != lastName || !transactions.committed {
		t.Fatalf("profile/transaction state = (%+v, committed %t), want profile for user and committed transaction", profiles.input, transactions.committed)
	}
	if len(calls) != 2 || calls[0] != "global admin" || calls[1] != "profile" {
		t.Fatalf("creation order = %v, want [global admin profile]", calls)
	}
}

func TestServiceCreateGlobalAdminRequiresAuthUserID(t *testing.T) {
	blank := "  \t "
	tests := []struct {
		name   string
		authID *string
	}{
		{name: "missing"},
		{name: "blank", authID: &blank},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			repository := &fakeRepository{}
			transactions := &fakeTransactionRunner{}
			service := userservice.NewService(repository, &fakeProfileCreator{}, transactions)

			_, err := service.CreateGlobalAdmin(context.Background(), userdomain.CreateInput{AuthUserID: test.authID}, userprofile.Details{})
			if !errors.Is(err, userdomain.ErrInvalidUser) {
				t.Fatalf("CreateGlobalAdmin error = %v, want ErrInvalidUser", err)
			}
			if repository.globalAdminCalled || transactions.called {
				t.Fatal("global admin creation started without an Auth user ID")
			}
		})
	}
}
