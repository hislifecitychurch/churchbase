package v1

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/health"
)

func Register(router fiber.Router, healthHandler *health.Handler) {
	router.Get("/health/live", healthHandler.Live)
	router.Get("/health/ready", healthHandler.Ready)
}
