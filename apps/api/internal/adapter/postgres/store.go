package postgres

import (
	"context"
	"database/sql"
	"time"

	"entgo.io/ent/dialect"
	dialectsql "entgo.io/ent/dialect/sql"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type Store struct {
	db     *sql.DB
	client *entclient.Client
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
	return &Store{db: db, client: client}, nil
}

func (s *Store) Ping(ctx context.Context) error {
	return s.db.PingContext(ctx)
}

func (s *Store) Close() error {
	return s.client.Close()
}
