package v1

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1/me"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/health"
	mehandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/me"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(router fiber.Router, healthHandler *health.Handler, validator authmiddleware.Validator, currentUserHandler *mehandler.Handler) {
	router.Get("/health/live", healthHandler.Live)
	router.Get("/health/ready", healthHandler.Ready)
	me.Register(router, validator, currentUserHandler)
}
