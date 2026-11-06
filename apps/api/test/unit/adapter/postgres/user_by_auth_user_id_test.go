package postgres_test

import (
	"context"
	"errors"
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	userrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	_ "github.com/mattn/go-sqlite3"
)

func TestUserRepositoryGetByAuthUserID(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-auth-lookup?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	const authUserID = "auth-user-lookup"
	created, err := client.User.Create().SetAuthUserID(authUserID).SetPlatformRole(entuser.PlatformRoleAdmin).Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}

	user, err := userrepository.NewUserRepository(client).GetByAuthUserID(context.Background(), authUserID)
	if err != nil {
		t.Fatal(err)
	}
	if user.ID != created.ID || user.AuthUserID == nil || *user.AuthUserID != authUserID || user.PlatformRole == nil || *user.PlatformRole != userdomain.PlatformRoleAdmin {
		t.Fatalf("user = %+v, want API user %s with Auth ID and admin role", user, created.ID)
	}
}

func TestUserRepositoryGetByAuthUserIDReturnsNotFound(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-auth-lookup-missing?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	_, err := userrepository.NewUserRepository(client).GetByAuthUserID(context.Background(), "missing-auth-user")
	if !errors.Is(err, userdomain.ErrUserNotFound) {
		t.Fatalf("GetByAuthUserID error = %v, want ErrUserNotFound", err)
	}
}
