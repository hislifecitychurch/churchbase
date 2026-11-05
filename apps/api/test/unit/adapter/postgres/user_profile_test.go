package postgres_test

import (
	"context"
	"errors"
	"testing"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/userprofile"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	userrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user"
	userprofilerepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user_profile"
	postgresTransaction "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
	userprofiledomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	userprofileservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile/service"
	_ "github.com/mattn/go-sqlite3"
)

func TestUserCreationCreatesProfile(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-profile-create?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	service := newUserService(client, userprofileservice.NewService(userprofilerepository.NewUserProfileRepository(client)))
	authUserID := "auth-user-1"
	created, err := service.CreatePlatformAdmin(context.Background(), user.CreateInput{AuthUserID: &authUserID})
	if err != nil {
		t.Fatal(err)
	}

	profile, err := client.UserProfile.Query().Where(userprofile.UserID(created.ID)).Only(context.Background())
	if err != nil {
		t.Fatalf("query created profile: %v", err)
	}
	if profile.UserID != created.ID {
		t.Fatalf("profile UserID = %s, want %s", profile.UserID, created.ID)
	}
}

func TestUserCreationRollsBackWhenProfileCreationFails(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-profile-create-rollback?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	profileErr := errors.New("profile creation failed after insert")
	profiles := &failAfterCreateProfile{
		creator: userprofileservice.NewService(userprofilerepository.NewUserProfileRepository(client)),
		err:     profileErr,
	}
	service := newUserService(client, profiles)
	authUserID := "auth-user-rollback"
	if _, err := service.CreatePlatformAdmin(context.Background(), user.CreateInput{AuthUserID: &authUserID}); !errors.Is(err, profileErr) {
		t.Fatalf("CreatePlatformAdmin error = %v, want profile error", err)
	}

	users, err := client.User.Query().Where(entuser.AuthUserID(authUserID)).All(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	profilesAfterRollback, err := client.UserProfile.Query().All(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(users) != 0 || len(profilesAfterRollback) != 0 {
		t.Fatalf("rows after rollback = (users: %d, profiles: %d), want (0, 0)", len(users), len(profilesAfterRollback))
	}
}

func newUserService(client *entclient.Client, profiles userservice.ProfileCreator) *userservice.Service {
	return userservice.NewService(
		userrepository.NewUserRepository(client),
		profiles,
		sqliteTransactionRunner{client: client},
	)
}

type sqliteTransactionRunner struct {
	client *entclient.Client
}

func (r sqliteTransactionRunner) WithinTransaction(ctx context.Context, run func(context.Context) error) error {
	return postgresTransaction.Within(ctx, r.client, run)
}

type failAfterCreateProfile struct {
	creator userservice.ProfileCreator
	err     error
}

func (r *failAfterCreateProfile) Create(ctx context.Context, input userprofiledomain.CreateInput) (userprofiledomain.Profile, error) {
	created, err := r.creator.Create(ctx, input)
	if err != nil {
		return userprofiledomain.Profile{}, err
	}
	return created, r.err
}
