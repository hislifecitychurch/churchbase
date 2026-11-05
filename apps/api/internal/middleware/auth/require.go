package auth

import (
	"context"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
)

type Validator interface {
	Validate(context.Context, string, string) (string, bool, error)
}

func Require(validator Validator) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Method() == fiber.MethodOptions {
			return c.Next()
		}
		cookie, authorization := c.Get("Cookie"), c.Get("Authorization")
		if strings.TrimSpace(cookie) == "" && strings.TrimSpace(authorization) == "" {
			return unauthorized(c)
		}
		if validator == nil {
			return unavailable(c)
		}

		authUserID, valid, err := validator.Validate(c.UserContext(), cookie, authorization)
		if err != nil {
			return unavailable(c)
		}
		if !valid || strings.TrimSpace(authUserID) == "" {
			return unauthorized(c)
		}

		c.SetUserContext(actor.WithID(c.UserContext(), authUserID))
		return c.Next()
	}
}

func unauthorized(c *fiber.Ctx) error {
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error":   "unauthorized",
		"message": "Authentication is required",
	})
}

func unavailable(c *fiber.Ctx) error {
	return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
		"error":   "auth_unavailable",
		"message": "Authentication service temporarily unavailable",
	})
}
