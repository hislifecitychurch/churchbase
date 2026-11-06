package v1

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1/users"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/health"
	userhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(router fiber.Router, healthHandler *health.Handler, validator authmiddleware.Validator, currentUserHandler *userhandler.Handler) {
	router.Get("/health/live", healthHandler.Live)
	router.Get("/health/ready", healthHandler.Ready)
	users.Register(router, validator, currentUserHandler)
}
