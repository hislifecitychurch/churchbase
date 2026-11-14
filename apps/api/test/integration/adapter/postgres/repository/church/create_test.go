package church_test

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"testing"
	"time"

	"entgo.io/ent/dialect"
	dialectsql "entgo.io/ent/dialect/sql"
	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	churchent "github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	churchmembership "github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	_ "github.com/hislifecitychurch/churchbase/apps/api/ent/runtime"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	churchrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func TestChurchRepositoryPostgresCreatesMultipleChurchesAndRejectsDuplicateSlug(t *testing.T) {
	databaseURL := os.Getenv("RL_TEST_DB_URL")
	if databaseURL == "" {
		t.Skip("set RL_TEST_DB_URL to a disposable PostgreSQL test database")
	}

	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		t.Fatal(err)
	}
	db.SetMaxOpenConns(1)
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		t.Fatalf("connect to PostgreSQL test database: %v", err)
	}

	client := entclient.NewClient(entclient.Driver(dialectsql.OpenDB(dialect.Postgres, db)))
	defer client.Close()
	soft_delete.ConfigureClient(client)
	repository := churchrepository.NewChurchRepository(client)
	rollback := errors.New("roll back church repository integration test")
	slugPrefix := "church-create-" + uuid.NewString()

	err = transaction.Within(ctx, client, func(txCtx context.Context) error {
		txCtx = actor.WithID(txCtx, "auth-integration-admin")
		first, err := repository.Create(txCtx, churchdomain.CreateInput{Name: "First Test Church", Slug: slugPrefix + "-one"})
		if err != nil {
			return err
		}
		second, err := repository.Create(txCtx, churchdomain.CreateInput{Name: "Second Test Church", Slug: slugPrefix + "-two"})
		if err != nil {
			return err
		}
		if first.ID == second.ID {
			return errors.New("creating distinct churches returned the same ID")
		}

		for _, church := range []churchdomain.Church{first, second} {
			count, err := transaction.Client(txCtx, client).ChurchMembership.Query().
				Where(churchmembership.ChurchID(church.ID)).
				Count(txCtx)
			if err != nil {
				return err
			}
			if count != 0 {
				return fmt.Errorf("church %s got %d implicit memberships, want 0", church.ID, count)
			}
		}

		if _, err := repository.Create(txCtx, churchdomain.CreateInput{Name: "Duplicate Test Church", Slug: slugPrefix + "-one"}); !errors.Is(err, churchdomain.ErrChurchSlugConflict) {
			return fmt.Errorf("duplicate slug error = %v, want ErrChurchSlugConflict", err)
		}
		// Roll back test churches instead of leaving rows in the shared database.
		return rollback
	})
	if !errors.Is(err, rollback) {
		t.Fatalf("transaction error = %v, want rollback marker", err)
	}
	count, err := client.Church.Query().Where(churchent.SlugIn(slugPrefix+"-one", slugPrefix+"-two")).Count(ctx)
	if err != nil || count != 0 {
		t.Fatalf("church rows remaining after rollback = %d, error = %v", count, err)
	}
}
