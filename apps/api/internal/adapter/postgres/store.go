package postgres

import (
	"context"
	"database/sql"
	"time"

	"entgo.io/ent/dialect"
	dialectsql "entgo.io/ent/dialect/sql"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	_ "github.com/hislifecitychurch/churchbase/apps/api/ent/runtime"
	userrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user"
	userprofilerepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/user_profile"
	postgresTransaction "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type Store struct {
	db     *sql.DB
	client *entclient.Client
}

func (s *Store) UserRepository() userdomain.Repository {
	return userrepository.NewUserRepository(s.client)
}

func (s *Store) UserProfileRepository() userprofile.Repository {
	return userprofilerepository.NewUserProfileRepository(s.client)
}

func (s *Store) WithinTransaction(ctx context.Context, run func(context.Context) error) error {
	return postgresTransaction.Within(ctx, s.client, run)
}

func New(databaseURL string) (*Store, error) {
	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(4 * time.Minute)
	db.SetConnMaxIdleTime(time.Minute)

	client := entclient.NewClient(entclient.Driver(dialectsql.OpenDB(dialect.Postgres, db)))
	ConfigureClient(client)
	return &Store{db: db, client: client}, nil
}

func (s *Store) Ping(ctx context.Context) error {
	return s.db.PingContext(ctx)
}

func (s *Store) Close() error {
	return s.client.Close()
}
