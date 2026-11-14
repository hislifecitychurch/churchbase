package v1

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1/churches"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1/users"
	workspaceaccessevents "github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1/workspace_access_events"
	churchhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/health"
	userhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	workspaceaccesshandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/workspace_access_event"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
)

func Register(
	router fiber.Router,
	healthHandler *health.Handler,
	validator authmiddleware.Validator,
	currentUserHandler *userhandler.Handler,
	workspaceAccessHandler *workspaceaccesshandler.Handler,
	churchHandler *churchhandler.Handler,
) {
	router.Get("/health/live", healthHandler.Live)
	router.Get("/health/ready", healthHandler.Ready)
	users.Register(router, validator, currentUserHandler)
	workspaceaccessevents.Register(router, validator, workspaceAccessHandler)
	churches.Register(router, validator, churchHandler)
}
