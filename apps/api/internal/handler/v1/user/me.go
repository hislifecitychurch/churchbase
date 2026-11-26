package user

import (
	"errors"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) Get(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, fiber.StatusUnauthorized, response.FailureWithError[any](
			"Unauthorized", "unauthorized", "Authentication is required", c, "me.unauthorized", "", "warning",
		))
	}

	current, err := h.currentUsers.GetByAuthUserID(c.UserContext(), authUserID)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, fiber.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "me.user.not_provisioned", "", "warning",
		))
	}
	if err != nil {
		log.Printf("current_user_lookup_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, fiber.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "me.lookup.failed", "", "error",
		))
	}

	return response.JSON(c, fiber.StatusOK, response.Success(currentUserResponse{
		ID:                  current.User.ID,
		GlobalRoles:         current.User.GlobalRoles,
		Profile:             profileResponse{FirstName: current.Profile.FirstName, LastName: current.Profile.LastName},
		LastWorkspaceAccess: toLastWorkspaceAccess(current.LastWorkspaceAccess),
	}, "Current user retrieved", c, "me.retrieved", current.User.ID.String(), "info"))
}

type currentUserResponse struct {
	ID                  uuid.UUID                    `json:"id"`
	GlobalRoles         *userdomain.GlobalRole       `json:"global_roles"`
	Profile             profileResponse              `json:"profile"`
	LastWorkspaceAccess *lastWorkspaceAccessResponse `json:"last_workspace_access"`
}

type lastWorkspaceAccessResponse struct {
	Workspace  workspaceaccessevent.Workspace `json:"workspace"`
	OccurredAt time.Time                      `json:"occurred_at"`
}

func toLastWorkspaceAccess(event *workspaceaccessevent.Event) *lastWorkspaceAccessResponse {
	if event == nil {
		return nil
	}
	return &lastWorkspaceAccessResponse{Workspace: event.Workspace, OccurredAt: event.OccurredAt}
}

type profileResponse struct {
	FirstName *string `json:"first_name"`
	LastName  *string `json:"last_name"`
}
