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

func TestChurchUpdateAllowsOnlyGlobalAdmin(t *testing.T) {
	admin := userdomain.GlobalRoleAdmin
	users := &churchCreationUserReader{user: userdomain.User{GlobalRoles: &admin}}
	updater := &churchUpdateFake{}
	service := application.NewChurchUpdateService(users, updater)
	churchID := uuid.New()
	input := churchdomain.UpdateInput{Name: "Updated Church"}

	if err := service.UpdateByAuthUserID(context.Background(), "auth-admin", churchID, input); err != nil {
		t.Fatal(err)
	}
	if users.authUserID != "auth-admin" || updater.calls != 1 || updater.churchID != churchID || updater.input != input {
		t.Fatalf("user lookup = %q, update calls = %d, church = %s, input = %+v", users.authUserID, updater.calls, updater.churchID, updater.input)
	}
}

func TestChurchUpdateRejectsStaffAndUnprovisionedUsers(t *testing.T) {
	staff := userdomain.GlobalRoleStaff
	for _, test := range []struct {
		name string
		user userdomain.User
		err  error
	}{
		{name: "global staff", user: userdomain.User{GlobalRoles: &staff}, err: application.ErrChurchUpdateForbidden},
		{name: "unprovisioned", err: userdomain.ErrUserNotFound},
	} {
		t.Run(test.name, func(t *testing.T) {
			updater := &churchUpdateFake{}
			service := application.NewChurchUpdateService(&churchCreationUserReader{user: test.user, err: test.err}, updater)
			if err := service.UpdateByAuthUserID(context.Background(), "auth-user", uuid.New(), churchdomain.UpdateInput{Name: "Church"}); !errors.Is(err, test.err) || updater.calls != 0 {
				t.Fatalf("update error = %v, update calls = %d", err, updater.calls)
			}
		})
	}
}

type churchUpdateFake struct {
	calls    int
	churchID uuid.UUID
	input    churchdomain.UpdateInput
	err      error
}

func (u *churchUpdateFake) Update(_ context.Context, churchID uuid.UUID, input churchdomain.UpdateInput) error {
	u.calls++
	u.churchID, u.input = churchID, input
	return u.err
}
