package application_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func TestChurchGetAllAllowsGlobalRoles(t *testing.T) {
	churches := []churchdomain.Church{{ID: uuid.New(), Name: "Example Church", Slug: "example"}}
	for _, role := range []userdomain.GlobalRole{userdomain.GlobalRoleAdmin, userdomain.GlobalRoleStaff} {
		t.Run(string(role), func(t *testing.T) {
			users := &churchCreationUserReader{user: userdomain.User{GlobalRoles: &role}}
			repository := &churchGetterFake{churches: churches}
			service := application.NewChurchDirectoryService(users, repository)

			got, err := service.GetAllByAuthUserID(context.Background(), "auth-global-user")
			if err != nil || len(got) != 1 || got[0] != churches[0] {
				t.Fatalf("GetAllByAuthUserID() = %+v, %v", got, err)
			}
			if users.authUserID != "auth-global-user" || repository.calls != 1 {
				t.Fatalf("auth user ID = %q, repository calls = %d", users.authUserID, repository.calls)
			}
		})
	}
}

func TestChurchGetAllRejectsOrdinaryAndUnprovisionedUsers(t *testing.T) {
	for _, test := range []struct {
		name string
		user userdomain.User
		err  error
	}{
		{name: "ordinary user", user: userdomain.User{}, err: application.ErrChurchDirectoryForbidden},
		{name: "unprovisioned user", err: userdomain.ErrUserNotFound},
	} {
		t.Run(test.name, func(t *testing.T) {
			repository := &churchGetterFake{}
			service := application.NewChurchDirectoryService(&churchCreationUserReader{user: test.user, err: test.err}, repository)
			if _, err := service.GetAllByAuthUserID(context.Background(), "auth-user"); !errors.Is(err, test.err) || repository.calls != 0 {
				t.Fatalf("GetAllByAuthUserID error = %v, repository calls = %d", err, repository.calls)
			}
		})
	}
}

type churchGetterFake struct {
	calls    int
	churches []churchdomain.Church
}

func (r *churchGetterFake) GetAll(context.Context) ([]churchdomain.Church, error) {
	r.calls++
	return r.churches, nil
}
