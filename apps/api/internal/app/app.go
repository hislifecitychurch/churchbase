package app

import (
	"context"
	"errors"
	"fmt"
	"net"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	betterauthadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/betterauth"
	postgresadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres"
	redisadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/redis"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/config"
	deliveryhttp "github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http"
	accesscontextservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context/service"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
	userprofileservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile/service"
	workspaceaccesseventservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event/service"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	workspaceaccesshandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/workspace_access_event"
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

	profiles := userprofileservice.NewService(db.UserProfileRepository())
	users := userservice.NewService(db.UserRepository(), profiles, db)
	workspaceAccessEvents := workspaceaccesseventservice.NewService(db.WorkspaceAccessEventRepository())
	currentUsers := application.NewCurrentUserReader(users, profiles, workspaceAccessEvents)
	accessContexts := accesscontextservice.NewService(db.AccessContextRepository())
	currentAccessContexts := application.NewCurrentAccessContextsReader(users, accessContexts)
	workspaceAccess := application.NewWorkspaceAccessService(users, workspaceAccessEvents, profiles)
	return &Application{
		http: deliveryhttp.New(
			cfg.AllowedOrigin,
			betterauthadapter.NewSessionClient(cfg.AuthBaseURL),
			user.NewHandler(currentUsers, currentAccessContexts),
			workspaceaccesshandler.NewHandler(workspaceAccess),
			db,
			redis,
		),
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
