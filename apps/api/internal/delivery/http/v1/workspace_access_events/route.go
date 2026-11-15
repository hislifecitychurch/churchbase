package workspaceaccessevents

import (
	"github.com/gofiber/fiber/v2"
	workspaceaccesshandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/workspace_access_event"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(router fiber.Router, validator authmiddleware.Validator, handler *workspaceaccesshandler.Handler) {
	router.Post("/users/me/workspace-access-events", authmiddleware.Require(validator), handler.Record)
	router.Get("/platform/workspace-access-events", authmiddleware.Require(validator), handler.GetAllForAdmin)
}
