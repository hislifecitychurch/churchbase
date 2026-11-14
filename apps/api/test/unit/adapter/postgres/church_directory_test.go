package postgres_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	churchrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/church"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	_ "github.com/mattn/go-sqlite3"
)

func TestChurchRepositoryListsActiveMemberCounts(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:church-directory?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	ctx := actor.WithID(context.Background(), "auth-test-admin")
	repository := churchrepository.NewChurchRepository(client)
	alpha, err := repository.Create(ctx, churchdomain.CreateInput{Name: "Alpha Church", Slug: "alpha"})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := repository.Create(ctx, churchdomain.CreateInput{Name: "Zulu Church", Slug: "zulu"}); err != nil {
		t.Fatal(err)
	}

	newUser := func(authUserID string) *ent.User {
		user, err := client.User.Create().SetAuthUserID(authUserID).Save(ctx)
		if err != nil {
			t.Fatal(err)
		}
		return user
	}
	activeMember := newUser("active-member")
	inactiveMember := newUser("inactive-member")
	staff := newUser("staff")
	deletedMembershipMember := newUser("deleted-membership-member")
	deletedUser := newUser("deleted-user")

	if _, err := client.ChurchMembership.Create().SetChurchID(alpha.ID).SetUserID(activeMember.ID).Save(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.ChurchMembership.Create().SetChurchID(alpha.ID).SetUserID(inactiveMember.ID).SetStatus(churchmembership.StatusInactive).Save(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.ChurchMembership.Create().SetChurchID(alpha.ID).SetUserID(staff.ID).SetRole(churchmembership.RoleStaff).Save(ctx); err != nil {
		t.Fatal(err)
	}
	deletedMembership, err := client.ChurchMembership.Create().SetChurchID(alpha.ID).SetUserID(deletedMembershipMember.ID).Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ChurchMembership.Create().SetChurchID(alpha.ID).SetUserID(deletedUser.ID).Save(ctx); err != nil {
		t.Fatal(err)
	}
	if err := client.ChurchMembership.DeleteOneID(deletedMembership.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}
	if err := client.User.DeleteOneID(deletedUser.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}

	churches, err := repository.GetAll(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(churches) != 2 || churches[0].ID != alpha.ID {
		t.Fatalf("churches = %+v, want Alpha and Zulu in name order", churches)
	}
	if churches[0].ActiveMemberCount != 1 {
		t.Fatalf("Alpha active member count = %d, want 1", churches[0].ActiveMemberCount)
	}
	if churches[1].ActiveMemberCount != 0 {
		t.Fatalf("Zulu active member count = %d, want 0", churches[1].ActiveMemberCount)
	}
}

func TestChurchRepositoryUpdatesAndClearsChurchMetadata(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:church-update?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	ctx := actor.WithID(context.Background(), "auth-test-admin")
	repository := churchrepository.NewChurchRepository(client)
	church, err := repository.Create(ctx, churchdomain.CreateInput{Name: "Old Name", Slug: "old-name"})
	if err != nil {
		t.Fatal(err)
	}
	timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
	if err := repository.Update(ctx, church.ID, churchdomain.UpdateInput{
		Name: "New Name", Timezone: &timezone, Website: &website, Bio: &bio,
	}); err != nil {
		t.Fatal(err)
	}
	churches, err := repository.GetAll(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(churches) != 1 || churches[0].Name != "New Name" || churches[0].Timezone == nil || *churches[0].Timezone != timezone || churches[0].Website == nil || *churches[0].Website != website || churches[0].Bio == nil || *churches[0].Bio != bio {
		t.Fatalf("updated church = %+v", churches)
	}
	if err := repository.Update(ctx, church.ID, churchdomain.UpdateInput{Name: "New Name"}); err != nil {
		t.Fatal(err)
	}
	churches, err = repository.GetAll(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if churches[0].Timezone != nil || churches[0].Website != nil || churches[0].Bio != nil {
		t.Fatalf("cleared metadata = %+v", churches[0])
	}
	if err := repository.Update(ctx, uuid.New(), churchdomain.UpdateInput{Name: "Missing"}); err != churchdomain.ErrChurchNotFound {
		t.Fatalf("missing church update error = %v, want ErrChurchNotFound", err)
	}
}
