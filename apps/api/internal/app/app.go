package app

import (
	"context"
	"errors"
	"fmt"
	"net"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	postgresadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	redisadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/redis"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/config"
	deliveryhttp "github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http"
)

type Application struct {
	http    *fiber.App
	address string
	db      *postgresadapter.Store
	redis   *redisadapter.Client
}

func New(cfg config.Config) (*Application, error) {
	db, err := postgresadapter.New(cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("configure PostgreSQL")
	}
	redis, err := redisadapter.New(cfg.RedisURL)
	if err != nil {
		_ = db.Close()
		return nil, err
	}

	return &Application{
		http:    deliveryhttp.New(cfg.AllowedOrigin, db, redis),
		address: net.JoinHostPort("", strconv.Itoa(cfg.Port)),
		db:      db,
		redis:   redis,
	}, nil
}

func (a *Application) Run(ctx context.Context) (runErr error) {
	defer func() { runErr = errors.Join(runErr, a.close()) }()

	listener, err := net.Listen("tcp", a.address)
	if err != nil {
		return fmt.Errorf("listen on %s: %w", a.address, err)
	}
	defer listener.Close()

	serveErr := make(chan error, 1)
	go func() { serveErr <- a.http.Listener(listener) }()

	select {
	case err := <-serveErr:
		return err
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		shutdownErr := a.http.ShutdownWithContext(shutdownCtx)
		return errors.Join(shutdownErr, <-serveErr)
	}
}

func (a *Application) close() error {
	return errors.Join(a.redis.Close(), a.db.Close())
}
