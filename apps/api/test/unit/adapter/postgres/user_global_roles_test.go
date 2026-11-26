package postgres_test

import (
	"context"
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	userrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	_ "github.com/mattn/go-sqlite3"
)

func TestUserRepositoryCreateGlobalAdmin(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:create-global-admin?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	authUserID := "auth-user-1"
	created, err := userrepository.NewUserRepository(client).CreateGlobalAdmin(context.Background(), userdomain.CreateInput{
		AuthUserID: &authUserID,
	})
	if err != nil {
		t.Fatal(err)
	}
	if created.AuthUserID == nil || *created.AuthUserID != authUserID {
		t.Fatalf("created Auth user ID = %v, want %q", created.AuthUserID, authUserID)
	}
	if created.GlobalRoles == nil || *created.GlobalRoles != userdomain.GlobalRoleAdmin {
		t.Fatalf("created global role = %v, want admin", created.GlobalRoles)
	}
}

func TestUserGlobalRolesIsOptionalAndRestricted(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-global-roles?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	ctx := context.Background()
	regularUser, err := client.User.Create().Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if regularUser.GlobalRoles != nil {
		t.Fatalf("regular user's global role = %v, want nil", *regularUser.GlobalRoles)
	}

	for _, role := range []entuser.GlobalRoles{entuser.GlobalRolesAdmin, entuser.GlobalRolesStaff} {
		created, err := client.User.Create().
			SetAuthUserID(string(role) + "-auth-id").
			SetGlobalRoles(role).
			Save(ctx)
		if err != nil {
			t.Fatalf("create user with global role %q: %v", role, err)
		}
		if created.GlobalRoles == nil || *created.GlobalRoles != role {
			t.Fatalf("stored global role = %v, want %q", created.GlobalRoles, role)
		}
	}

	if _, err := client.User.Create().
		SetGlobalRoles(entuser.GlobalRolesAdmin).
		Save(ctx); err == nil {
		t.Fatal("created global admin without an Auth user ID")
	}
	if _, err := client.User.Create().
		SetAuthUserID("auth-user-invalid-role").
		SetGlobalRoles(entuser.GlobalRoles("member")).
		Save(ctx); err == nil {
		t.Fatal("created user with unsupported global role")
	}
}
