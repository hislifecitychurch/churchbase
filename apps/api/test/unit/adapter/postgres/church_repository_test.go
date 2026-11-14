package postgres_test

import (
	"context"
	"errors"
	"testing"

	churchent "github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	churchrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/church"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	_ "github.com/mattn/go-sqlite3"
)

func TestChurchRepositoryCreatesMultipleChurchesAndMapsDuplicateSlug(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:church-create?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	repository := churchrepository.NewChurchRepository(client)
	ctx := actor.WithID(context.Background(), "auth-admin")
	first, err := repository.Create(ctx, churchdomain.CreateInput{Name: "First Church", Slug: "first-church"})
	if err != nil {
		t.Fatal(err)
	}
	second, err := repository.Create(ctx, churchdomain.CreateInput{Name: "Second Church", Slug: "second-church"})
	if err != nil || first.ID == second.ID {
		t.Fatalf("second church = %+v, error = %v", second, err)
	}
	if _, err := repository.Create(ctx, churchdomain.CreateInput{Name: "Duplicate", Slug: "first-church"}); !errors.Is(err, churchdomain.ErrChurchSlugConflict) {
		t.Fatalf("duplicate slug error = %v, want ErrChurchSlugConflict", err)
	}

	count, err := client.Church.Query().Count(context.Background())
	if err != nil || count != 2 {
		t.Fatalf("church count = %d, error = %v; want 2", count, err)
	}
	memberships, err := client.ChurchMembership.Query().Count(context.Background())
	if err != nil || memberships != 0 {
		t.Fatalf("church membership count = %d, error = %v; want 0", memberships, err)
	}
	stored, err := client.Church.Query().Where(churchent.ID(first.ID)).Only(ctx)
	if err != nil || stored.CreatedBy == nil || *stored.CreatedBy != "auth-admin" {
		t.Fatalf("created_by = %v, error = %v", stored.CreatedBy, err)
	}
}
