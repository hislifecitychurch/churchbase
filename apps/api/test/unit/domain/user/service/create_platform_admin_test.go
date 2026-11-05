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
	repository := &fakeRepository{result: expected}
	service := userservice.NewService(repository)

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
			service := userservice.NewService(repository)

			_, err := service.CreatePlatformAdmin(context.Background(), userdomain.CreateInput{AuthUserID: test.authID})
			if !errors.Is(err, userdomain.ErrInvalidUser) {
				t.Fatalf("CreatePlatformAdmin error = %v, want ErrInvalidUser", err)
			}
			if repository.platformAdminCalled {
				t.Fatal("repository CreatePlatformAdmin called without an Auth user ID")
			}
		})
	}
}
