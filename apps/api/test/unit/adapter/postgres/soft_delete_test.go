package postgres_test

import (
	"context"
	"testing"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/userprofile"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	_ "github.com/mattn/go-sqlite3"
)

func TestDeleteSoftDeletesAndHidesByDefault(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:soft-delete?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	ctx := actor.WithID(context.Background(), "auth-user-1")
	created, err := client.Church.Create().SetName("Test Church").SetSlug("test-church").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if created.CreatedBy == nil || *created.CreatedBy != "auth-user-1" {
		t.Fatalf("CreatedBy = %v, want auth-user-1", created.CreatedBy)
	}
	updatedCtx := actor.WithID(ctx, "auth-user-2")
	updated, err := client.Church.UpdateOneID(created.ID).SetName("Updated Test Church").Save(updatedCtx)
	if err != nil {
		t.Fatal(err)
	}
	if updated.UpdatedBy == nil || *updated.UpdatedBy != "auth-user-2" {
		t.Fatalf("UpdatedBy = %v, want auth-user-2", updated.UpdatedBy)
	}

	if err := client.Church.DeleteOneID(created.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.Church.Get(ctx, created.ID); !entclient.IsNotFound(err) {
		t.Fatalf("default query error = %v, want not found", err)
	}

	deleted, err := client.Church.Query().Where(church.ID(created.ID)).Only(mixin.IncludeDeleted(ctx))
	if err != nil {
		t.Fatal(err)
	}
	if deleted.DeletedAt == nil || deleted.DeletedBy == nil || *deleted.DeletedBy != "auth-user-1" {
		t.Fatalf("deleted fields = (%v, %v), want timestamp and auth-user-1", deleted.DeletedAt, deleted.DeletedBy)
	}
	if deleted.UpdatedBy == nil || *deleted.UpdatedBy != "auth-user-1" {
		t.Fatalf("UpdatedBy after delete = %v, want auth-user-1", deleted.UpdatedBy)
	}
	if err := client.Church.DeleteOneID(created.ID).Exec(ctx); !entclient.IsNotFound(err) {
		t.Fatalf("repeated delete error = %v, want not found", err)
	}
}

func TestUserAndProfileDeletesAreFiltered(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:user-soft-delete?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	ctx := context.Background()
	createdUser, err := client.User.Create().SetFirstName("Test").SetLastName("User").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if createdUser.FirstName == nil || *createdUser.FirstName != "Test" || createdUser.LastName == nil || *createdUser.LastName != "User" {
		t.Fatalf("name = (%v, %v), want (Test, User)", createdUser.FirstName, createdUser.LastName)
	}
	if createdUser.AuthUserID != nil {
		t.Fatalf("AuthUserID = %v, want nil for a directory user without an account", createdUser.AuthUserID)
	}
	createdChurch, err := client.Church.Create().SetName("Test Church").SetSlug("test-church").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	membership, err := client.ChurchMembership.Create().SetChurch(createdChurch).SetUser(createdUser).Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if membership.UserID != createdUser.ID {
		t.Fatalf("membership UserID = %s, want %s", membership.UserID, createdUser.ID)
	}

	createdProfile, err := client.UserProfile.Create().SetUserID(createdUser.ID).SetBio("Test bio").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}

	if err := client.UserProfile.DeleteOneID(createdProfile.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.UserProfile.Get(ctx, createdProfile.ID); !entclient.IsNotFound(err) {
		t.Fatalf("default profile query error = %v, want not found", err)
	}
	deletedProfile, err := client.UserProfile.Query().Where(userprofile.ID(createdProfile.ID)).Only(mixin.IncludeDeleted(ctx))
	if err != nil {
		t.Fatal(err)
	}
	if deletedProfile.DeletedAt == nil {
		t.Fatal("profile DeletedAt = nil, want timestamp")
	}

	if err := client.User.DeleteOneID(createdUser.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.User.Get(ctx, createdUser.ID); !entclient.IsNotFound(err) {
		t.Fatalf("default user query error = %v, want not found", err)
	}
	deletedUser, err := client.User.Query().Where(user.ID(createdUser.ID)).Only(mixin.IncludeDeleted(ctx))
	if err != nil {
		t.Fatal(err)
	}
	if deletedUser.DeletedAt == nil {
		t.Fatal("user DeletedAt = nil, want timestamp")
	}
}
