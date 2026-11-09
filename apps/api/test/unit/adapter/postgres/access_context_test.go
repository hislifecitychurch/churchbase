package postgres_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministrymembership"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	accesscontextrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/access_context"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	_ "github.com/mattn/go-sqlite3"
)

func TestAccessContextRepositoryListsOnlyActiveSameChurchMemberships(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:access-contexts?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	ctx := context.Background()
	church, err := client.Church.Create().SetName("Sample Church").SetSlug("sample").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	otherChurch, err := client.Church.Create().SetName("Other Church").SetSlug("other").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	user, err := client.User.Create().SetAuthUserID("auth-user-1").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	membership, err := client.ChurchMembership.Create().SetChurch(church).SetUser(user).SetRole(churchmembership.RoleStaff).Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	inactiveMembership, err := client.ChurchMembership.Create().SetChurch(otherChurch).SetUser(user).SetStatus(churchmembership.StatusInactive).Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	activeMinistry, err := client.Ministry.Create().SetChurch(church).SetName("Broadcast").SetSlug("broadcast").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	inactiveMinistry, err := client.Ministry.Create().SetChurch(church).SetName("Inactive").SetSlug("inactive").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	foreignMinistry, err := client.Ministry.Create().SetChurch(otherChurch).SetName("Foreign").SetSlug("foreign").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	inactiveChurchMinistry, err := client.Ministry.Create().SetChurch(otherChurch).SetName("Inactive church assignment").SetSlug("inactive-church-assignment").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.MinistryMembership.Create().SetMinistry(activeMinistry).SetChurchMembership(membership).SetRole(ministrymembership.RoleLead).Save(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.MinistryMembership.Create().SetMinistry(inactiveMinistry).SetChurchMembership(membership).SetStatus(ministrymembership.StatusInactive).Save(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.MinistryMembership.Create().SetMinistry(foreignMinistry).SetChurchMembership(membership).Save(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.MinistryMembership.Create().SetMinistry(inactiveChurchMinistry).SetChurchMembership(inactiveMembership).Save(ctx); err != nil {
		t.Fatal(err)
	}
	contexts, err := accesscontextrepository.NewAccessContextRepository(client).ListByUserID(ctx, user.ID)
	if err != nil {
		t.Fatal(err)
	}
	if len(contexts) != 2 {
		t.Fatalf("got %d membership contexts, want church + same-church ministry: %+v", len(contexts), contexts)
	}
	if contexts[0].Kind != accesscontext.KindChurch || contexts[0].ChurchName != "Sample Church" || contexts[0].Role != "staff" {
		t.Fatalf("church context = %+v", contexts[0])
	}
	if contexts[1].Kind != accesscontext.KindMinistry || contexts[1].Slug != "broadcast" || contexts[1].ChurchID != church.ID {
		t.Fatalf("ministry context = %+v", contexts[1])
	}
	if contexts[1].ID == uuid.Nil {
		t.Fatal("ministry context has empty ID")
	}
}
