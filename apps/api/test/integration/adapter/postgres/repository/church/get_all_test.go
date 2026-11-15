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
	_ "github.com/hislifecitychurch/churchbase/apps/api/ent/runtime"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	churchrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func TestChurchRepositoryPostgresGetsAllByNameAndExcludesSoftDeleted(t *testing.T) {
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
	prefix := "church-list-" + uuid.NewString()
	slugs := []string{prefix + "-alpha", prefix + "-zulu", prefix + "-deleted"}

	err = transaction.Within(ctx, client, func(txCtx context.Context) error {
		txCtx = actor.WithID(txCtx, "auth-integration-admin")
		timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
		city, state, countryCode := "Springfield", "Illinois", "US"
		alpha, err := repository.Create(txCtx, churchdomain.CreateInput{
			Name: prefix + " Alpha", Slug: slugs[0], Timezone: &timezone, Website: &website, Bio: &bio,
			City: &city, StateOrProvince: &state, CountryCode: &countryCode,
		})
		if err != nil {
			return err
		}
		zulu, err := repository.Create(txCtx, churchdomain.CreateInput{Name: prefix + " Zulu", Slug: slugs[1]})
		if err != nil {
			return err
		}
		deleted, err := repository.Create(txCtx, churchdomain.CreateInput{Name: prefix + " Deleted", Slug: slugs[2]})
		if err != nil {
			return err
		}

		churches, err := repository.GetAll(txCtx)
		if err != nil {
			return err
		}
		positions := make(map[uuid.UUID]int, 2)
		for index, church := range churches {
			if index > 0 && churches[index-1].Name > church.Name {
				return fmt.Errorf("churches are not sorted by name at positions %d and %d", index-1, index)
			}
			if church.ID == alpha.ID || church.ID == zulu.ID {
				positions[church.ID] = index
			}
			if church.ID == alpha.ID && (church.Timezone == nil || *church.Timezone != timezone || church.Website == nil || *church.Website != website || church.Bio == nil || *church.Bio != bio || church.City == nil || *church.City != city || church.StateOrProvince == nil || *church.StateOrProvince != state || church.CountryCode == nil || *church.CountryCode != countryCode) {
				return fmt.Errorf("GetAll did not return alpha metadata: %+v", church)
			}
		}
		if positions[alpha.ID] >= positions[zulu.ID] {
			return errors.New("Alpha church did not precede Zulu church")
		}

		if err := transaction.Client(txCtx, client).Church.DeleteOneID(deleted.ID).Exec(txCtx); err != nil {
			return err
		}
		churches, err = repository.GetAll(txCtx)
		if err != nil {
			return err
		}
		for _, church := range churches {
			if church.ID == deleted.ID {
				return errors.New("soft-deleted church appeared in GetAll result")
			}
		}
		// Roll back test churches instead of leaving rows in the shared database.
		return rollback
	})
	if !errors.Is(err, rollback) {
		t.Fatalf("transaction error = %v, want rollback marker", err)
	}
	count, err := client.Church.Query().Where(churchent.SlugIn(slugs...)).Count(ctx)
	if err != nil || count != 0 {
		t.Fatalf("church rows remaining after rollback = %d, error = %v", count, err)
	}
}
