package auth

import (
	"context"
	"log"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
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
			log.Printf("auth_session_validator_unavailable request_id=%q", c.GetRespHeader(fiber.HeaderXRequestID))
			return unavailable(c)
		}

		authUserID, valid, err := validator.Validate(c.UserContext(), cookie, authorization)
		if err != nil {
			log.Printf("auth_session_validation_failed request_id=%q error=%v", c.GetRespHeader(fiber.HeaderXRequestID), err)
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
	return response.JSON(c, fiber.StatusUnauthorized, response.FailureWithError[any](
		"Unauthorized", "unauthorized", "Authentication is required", c, "auth.unauthorized", "", "warning",
	))
}

func unavailable(c *fiber.Ctx) error {
	return response.JSON(c, fiber.StatusServiceUnavailable, response.Failure[any](
		"Authentication service temporarily unavailable", "auth_unavailable", c, "auth.service.unavailable", "", "error",
	))
}
