package postgres_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	userprofilerepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user_profile"
	_ "github.com/mattn/go-sqlite3"
)

func TestUserProfileRepositoryGetByUserIDs(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-profile-batch-lookup?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	firstUser, err := client.User.Create().Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	secondUser, err := client.User.Create().Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.UserProfile.Create().SetUserID(firstUser.ID).SetFirstName("Ada").Save(context.Background()); err != nil {
		t.Fatal(err)
	}
	if _, err := client.UserProfile.Create().SetUserID(secondUser.ID).SetFirstName("Grace").Save(context.Background()); err != nil {
		t.Fatal(err)
	}

	profiles, err := userprofilerepository.NewUserProfileRepository(client).GetByUserIDs(context.Background(), []uuid.UUID{firstUser.ID, secondUser.ID})
	if err != nil {
		t.Fatal(err)
	}
	if len(profiles) != 2 {
		t.Fatalf("GetByUserIDs returned %d profiles, want 2", len(profiles))
	}
}
