package me

import (
	"github.com/gofiber/fiber/v2"
	mehandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/me"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(router fiber.Router, validator authmiddleware.Validator, handler *mehandler.Handler) {
	router.Get("/me", authmiddleware.Require(validator), handler.Get)
}
