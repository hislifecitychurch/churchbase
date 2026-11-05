package postgres_test

import (
	"context"
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	_ "github.com/mattn/go-sqlite3"
)

func TestUserPlatformRoleIsOptionalAndRestricted(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-platform-role?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	ctx := context.Background()
	regularUser, err := client.User.Create().SetFirstName("Regular").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if regularUser.PlatformRole != nil {
		t.Fatalf("regular user's platform role = %v, want nil", *regularUser.PlatformRole)
	}

	for _, role := range []entuser.PlatformRole{entuser.PlatformRoleAdmin, entuser.PlatformRoleStaff} {
		created, err := client.User.Create().
			SetAuthUserID(string(role) + "-auth-id").
			SetPlatformRole(role).
			Save(ctx)
		if err != nil {
			t.Fatalf("create user with platform role %q: %v", role, err)
		}
		if created.PlatformRole == nil || *created.PlatformRole != role {
			t.Fatalf("platform role = %v, want %q", created.PlatformRole, role)
		}
	}

	if _, err := client.User.Create().
		SetPlatformRole(entuser.PlatformRoleAdmin).
		Save(ctx); err == nil {
		t.Fatal("created platform admin without an Auth user ID")
	}
	if _, err := client.User.Create().
		SetAuthUserID("auth-user-invalid-role").
		SetPlatformRole(entuser.PlatformRole("member")).
		Save(ctx); err == nil {
		t.Fatal("created user with unsupported platform role")
	}
}
