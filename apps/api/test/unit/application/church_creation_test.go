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

func TestChurchCreationAllowsOnlyGlobalAdminAndCreatesMultipleChurches(t *testing.T) {
	admin := userdomain.GlobalRoleAdmin
	users := &churchCreationUserReader{user: userdomain.User{GlobalRoles: &admin}}
	churches := &churchCreationRepositoryFake{}
	service := application.NewChurchCreationService(users, churches)

	for _, input := range []churchdomain.CreateInput{
		{Name: "First Church", Slug: "first-church"},
		{Name: "Second Church", Slug: "second-church"},
	} {
		created, err := service.CreateByAuthUserID(context.Background(), "auth-admin", input)
		if err != nil || created.Name != input.Name || created.Slug != input.Slug {
			t.Fatalf("CreateByAuthUserID(%+v) = %+v, %v", input, created, err)
		}
	}
	if churches.calls != 2 || users.authUserID != "auth-admin" {
		t.Fatalf("create calls = %d, looked-up Auth ID = %q", churches.calls, users.authUserID)
	}
}

func TestChurchCreationRejectsNonAdminsAndUnprovisionedUsers(t *testing.T) {
	staff := userdomain.GlobalRoleStaff
	for _, test := range []struct {
		name string
		user userdomain.User
		err  error
	}{
		{name: "ordinary user", user: userdomain.User{}, err: application.ErrChurchCreationForbidden},
		{name: "global staff", user: userdomain.User{GlobalRoles: &staff}, err: application.ErrChurchCreationForbidden},
	} {
		t.Run(test.name, func(t *testing.T) {
			churches := &churchCreationRepositoryFake{}
			service := application.NewChurchCreationService(&churchCreationUserReader{user: test.user}, churches)
			if _, err := service.CreateByAuthUserID(context.Background(), "auth-user", churchdomain.CreateInput{Name: "Sample", Slug: "sample"}); !errors.Is(err, test.err) || churches.calls != 0 {
				t.Fatalf("creation error = %v, create calls = %d", err, churches.calls)
			}
		})
	}

	lookupErr := userdomain.ErrUserNotFound
	churches := &churchCreationRepositoryFake{}
	service := application.NewChurchCreationService(&churchCreationUserReader{err: lookupErr}, churches)
	if _, err := service.CreateByAuthUserID(context.Background(), "auth-unprovisioned", churchdomain.CreateInput{Name: "Sample", Slug: "sample"}); !errors.Is(err, lookupErr) || churches.calls != 0 {
		t.Fatalf("unprovisioned creation error = %v, create calls = %d", err, churches.calls)
	}
}

type churchCreationUserReader struct {
	authUserID string
	user       userdomain.User
	err        error
}

func (r *churchCreationUserReader) GetByAuthUserID(_ context.Context, authUserID string) (userdomain.User, error) {
	r.authUserID = authUserID
	return r.user, r.err
}

type churchCreationRepositoryFake struct {
	calls int
}

func (r *churchCreationRepositoryFake) Create(_ context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	r.calls++
	return churchdomain.Church{ID: uuid.New(), Name: input.Name, Slug: input.Slug}, nil
}
