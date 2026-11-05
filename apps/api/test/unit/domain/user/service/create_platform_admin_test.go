package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
)

func TestServiceCreatePlatformAdmin(t *testing.T) {
	authUserID := "auth-user-1"
	platformRole := userdomain.PlatformRoleAdmin
	expected := userdomain.User{
		ID:           uuid.New(),
		AuthUserID:   &authUserID,
		PlatformRole: &platformRole,
	}
	calls := []string{}
	repository := &fakeRepository{result: expected, calls: &calls}
	profiles := &fakeProfileCreator{calls: &calls}
	transactions := &fakeTransactionRunner{}
	service := userservice.NewService(repository, profiles, transactions)

	created, err := service.CreatePlatformAdmin(context.Background(), userdomain.CreateInput{AuthUserID: &authUserID})
	if err != nil {
		t.Fatal(err)
	}
	if !repository.platformAdminCalled || repository.called {
		t.Fatalf("repository calls = (create: %t, create platform admin: %t), want (false, true)", repository.called, repository.platformAdminCalled)
	}
	if repository.input.AuthUserID == nil || *repository.input.AuthUserID != authUserID {
		t.Fatalf("repository AuthUserID = %v, want %q", repository.input.AuthUserID, authUserID)
	}
	if created.ID != expected.ID || created.PlatformRole == nil || *created.PlatformRole != userdomain.PlatformRoleAdmin {
		t.Fatalf("created user = %+v, want platform admin with ID %s", created, expected.ID)
	}
	if !profiles.called || profiles.input.UserID != expected.ID || !transactions.committed {
		t.Fatalf("profile/transaction state = (%+v, committed %t), want profile for user and committed transaction", profiles.input, transactions.committed)
	}
	if len(calls) != 2 || calls[0] != "platform admin" || calls[1] != "profile" {
		t.Fatalf("creation order = %v, want [platform admin profile]", calls)
	}
}

func TestServiceCreatePlatformAdminRequiresAuthUserID(t *testing.T) {
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

			_, err := service.CreatePlatformAdmin(context.Background(), userdomain.CreateInput{AuthUserID: test.authID})
			if !errors.Is(err, userdomain.ErrInvalidUser) {
				t.Fatalf("CreatePlatformAdmin error = %v, want ErrInvalidUser", err)
			}
			if repository.platformAdminCalled || transactions.called {
				t.Fatal("platform admin creation started without an Auth user ID")
			}
		})
	}
}
