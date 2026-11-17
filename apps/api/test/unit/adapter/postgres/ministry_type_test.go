package postgres_test

import (
	"context"
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministry"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	_ "github.com/mattn/go-sqlite3"
)

func TestMinistryTypeIsUniquePerChurchAmongActiveMinistries(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:ministry-types?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	ctx := context.Background()
	church, err := client.Church.Create().SetName("Sample Church").SetSlug("sample").Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	kids, err := client.Ministry.Create().SetChurch(church).SetName("Kids Ministry").SetType(ministry.TypeKids).Save(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.Ministry.Create().SetChurch(church).SetName("Another Kids Ministry").SetType(ministry.TypeKids).Save(ctx); err == nil {
		t.Fatal("created a second active ministry of the same type")
	}
	if _, err := client.Ministry.Create().SetChurch(church).SetName("Broadcast Team").SetType(ministry.TypeBroadcast).Save(ctx); err != nil {
		t.Fatalf("created another supported type: %v", err)
	}
	if _, err := client.Ministry.Create().SetChurch(church).SetName("Uncatalogued Ministry").SetType("other").Save(ctx); err == nil {
		t.Fatal("created a ministry with an uncatalogued type")
	}
	if err := client.Ministry.DeleteOneID(kids.ID).Exec(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := client.Ministry.Create().SetChurch(church).SetName("Kids Team").SetType(ministry.TypeKids).Save(ctx); err != nil {
		t.Fatalf("recreated a soft-deleted ministry type: %v", err)
	}
}
