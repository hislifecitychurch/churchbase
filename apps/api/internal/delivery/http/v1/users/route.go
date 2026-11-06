package users

import (
	"github.com/gofiber/fiber/v2"
	userhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(router fiber.Router, validator authmiddleware.Validator, handler *userhandler.Handler) {
	router.Get("/users/me", authmiddleware.Require(validator), handler.Get)
}
