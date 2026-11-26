package postgres_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	ministryent "github.com/hislifecitychurch/churchbase/apps/api/ent/ministry"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	churchrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/church"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	_ "github.com/mattn/go-sqlite3"
)

func TestChurchRepositoryGetsByIDWithProfileAndCounts(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:church-by-id?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	ctx := actor.WithID(context.Background(), "auth-test-admin")
	repository := churchrepository.NewChurchRepository(client)
	timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
	city, state, countryCode := "Springfield", "Illinois", "US"
	church, err := repository.Create(ctx, churchdomain.CreateInput{
		Name: "Example Church", Slug: "example", Timezone: &timezone, Website: &website, Bio: &bio,
		City: &city, StateOrProvince: &state, CountryCode: &countryCode,
	})
	if err != nil {
		t.Fatal(err)
	}

	member, err := client.User.Create().SetAuthUserID("active-member").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ChurchMembership.Create().SetChurchID(church.ID).SetUserID(member.ID).Save(ctx); err != nil {
		t.Fatal(err)
	}
	inactiveMember, err := client.User.Create().SetAuthUserID("inactive-member").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.ChurchMembership.Create().SetChurchID(church.ID).SetUserID(inactiveMember.ID).SetStatus(churchmembership.StatusInactive).Save(ctx); err != nil {
		t.Fatal(err)
	}

	if _, err := client.Ministry.Create().SetChurchID(church.ID).SetName("Kids Ministry").SetType(ministryent.TypeKids).Save(ctx); err != nil {
		t.Fatal(err)
	}
	deletedMinistry, err := client.Ministry.Create().SetChurchID(church.ID).SetName("Deleted ministry").SetType(ministryent.TypeBroadcast).Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if err := client.Ministry.DeleteOneID(deletedMinistry.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}

	got, err := repository.GetByID(ctx, church.ID)
	if err != nil {
		t.Fatal(err)
	}
	if got.Name != "Example Church" || got.Slug != "example" || got.Timezone == nil || *got.Timezone != timezone || got.Website == nil || *got.Website != website || got.Bio == nil || *got.Bio != bio || got.City == nil || *got.City != city || got.StateOrProvince == nil || *got.StateOrProvince != state || got.CountryCode == nil || *got.CountryCode != countryCode || got.ActiveMemberCount != 1 || got.MinistryCount != 1 {
		t.Fatalf("GetByID() = %+v", got)
	}

	if _, err := repository.GetByID(ctx, uuid.New()); err != churchdomain.ErrChurchNotFound {
		t.Fatalf("missing church error = %v, want ErrChurchNotFound", err)
	}
	if err := client.Church.DeleteOneID(church.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := repository.GetByID(ctx, church.ID); err != churchdomain.ErrChurchNotFound {
		t.Fatalf("soft-deleted church error = %v, want ErrChurchNotFound", err)
	}
}
