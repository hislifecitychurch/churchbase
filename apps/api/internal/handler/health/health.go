package health

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/pkg/response"
)

type Checker interface {
	Ping(context.Context) error
}

type Handler struct {
	dependencies []Checker
}

func New(dependencies ...Checker) *Handler {
	return &Handler{dependencies: dependencies}
}

func (h *Handler) Live(c *fiber.Ctx) error {
	return response.JSON(c, fiber.StatusOK, response.Success(
		fiber.Map{"status": "UP"}, "API is live", c, "health.live", "", "info",
	))
}

func (h *Handler) Ready(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), 2*time.Second)
	defer cancel()
	for _, dependency := range h.dependencies {
		if err := dependency.Ping(ctx); err != nil {
			return response.JSON(c, fiber.StatusServiceUnavailable, response.FailureWithError[any](
				"API is not ready", "not_ready", "A required dependency is unavailable", c, "health.ready.failed", "", "warning",
			))
		}
	}
	return response.JSON(c, fiber.StatusOK, response.Success(
		fiber.Map{"status": "UP"}, "API is ready", c, "health.ready", "", "info",
	))
}
