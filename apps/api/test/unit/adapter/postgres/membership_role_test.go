package postgres_test

import (
	"context"
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministrymembership"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	_ "github.com/mattn/go-sqlite3"
)

func TestChurchStaffAndMinistryLeadRoles(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:membership-roles?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	postgres.ConfigureClient(client)

	ctx := context.Background()
	church, err := client.Church.Create().SetName("Test Church").SetSlug("test-church").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	user, err := client.User.Create().Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	churchMembership, err := client.ChurchMembership.Create().
		SetChurch(church).
		SetUser(user).
		SetRole(churchmembership.RoleStaff).
		Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if churchMembership.Role != churchmembership.RoleStaff {
		t.Fatalf("church membership role = %q, want staff", churchMembership.Role)
	}

	ministry, err := client.Ministry.Create().SetChurch(church).SetName("Test Ministry").SetSlug("test-ministry").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.MinistryMembership.Create().
		SetMinistry(ministry).
		SetChurchMembership(churchMembership).
		SetRole(ministrymembership.Role("leader")).
		Save(ctx); err == nil {
		t.Fatal("created ministry membership with the old leader role")
	}
	ministryMembership, err := client.MinistryMembership.Create().
		SetMinistry(ministry).
		SetChurchMembership(churchMembership).
		SetRole(ministrymembership.RoleLead).
		Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if ministryMembership.Role != ministrymembership.RoleLead {
		t.Fatalf("ministry membership role = %q, want lead", ministryMembership.Role)
	}
}
