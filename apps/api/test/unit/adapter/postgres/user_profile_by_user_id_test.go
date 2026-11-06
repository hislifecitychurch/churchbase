package postgres_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	userprofilerepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user_profile"
	userprofiledomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	_ "github.com/mattn/go-sqlite3"
)

func TestUserProfileRepositoryGetByUserID(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-profile-lookup?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	owner, err := client.User.Create().Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	firstName, lastName := "Ada", "Lovelace"
	created, err := client.UserProfile.Create().SetUserID(owner.ID).SetFirstName(firstName).SetLastName(lastName).Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}

	profile, err := userprofilerepository.NewUserProfileRepository(client).GetByUserID(context.Background(), owner.ID)
	if err != nil {
		t.Fatal(err)
	}
	if profile.ID != created.ID || profile.UserID != owner.ID || profile.FirstName == nil || *profile.FirstName != firstName || profile.LastName == nil || *profile.LastName != lastName {
		t.Fatalf("profile = %+v, want profile %s for API user %s with names %q %q", profile, created.ID, owner.ID, firstName, lastName)
	}
}

func TestUserProfileRepositoryGetByUserIDReturnsNotFound(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-profile-lookup-missing?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	_, err := userprofilerepository.NewUserProfileRepository(client).GetByUserID(context.Background(), uuid.New())
	if !errors.Is(err, userprofiledomain.ErrProfileNotFound) {
		t.Fatalf("GetByUserID error = %v, want ErrProfileNotFound", err)
	}
}
