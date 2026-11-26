package churches

import (
	"github.com/gofiber/fiber/v2"
	churchhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/church"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(router fiber.Router, validator authmiddleware.Validator, handler *churchhandler.Handler) {
	router.Get("/churches", authmiddleware.Require(validator), handler.GetAll)
	router.Get("/churches/:churchID", authmiddleware.Require(validator), handler.GetByID)
	router.Post("/churches", authmiddleware.Require(validator), handler.Create)
	router.Put("/churches/:churchID", authmiddleware.Require(validator), handler.Update)
}
