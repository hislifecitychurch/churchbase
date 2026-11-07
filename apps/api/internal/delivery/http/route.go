package http

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	httpv1 "github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/health"
	userhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	workspaceaccesshandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/workspace_access_event"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func New(
	allowedOrigins string,
	validator authmiddleware.Validator,
	currentUserHandler *userhandler.Handler,
	workspaceAccessHandler *workspaceaccesshandler.Handler,
	dependencies ...health.Checker,
) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:               "Churchbase API",
		DisableStartupMessage: true,
		BodyLimit:             1 << 20,
	})
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.TrimSpace(allowedOrigins),
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Authorization,Content-Type",
		AllowCredentials: true,
	}))

	httpv1.Register(app.Group("/api/v1"), health.New(dependencies...), validator, currentUserHandler, workspaceAccessHandler)
	return app
}
