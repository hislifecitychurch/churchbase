package health

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
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
	return c.JSON(fiber.Map{"status": "UP"})
}

func (h *Handler) Ready(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), 2*time.Second)
	defer cancel()
	for _, dependency := range h.dependencies {
		if err := dependency.Ping(ctx); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"status": "DOWN"})
		}
	}
	return c.JSON(fiber.Map{"status": "UP"})
}
