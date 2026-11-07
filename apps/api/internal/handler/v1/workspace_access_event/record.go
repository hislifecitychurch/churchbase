package workspaceaccessevent

import (
	"errors"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) Record(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, http.StatusUnauthorized, response.Failure[any](
			"Unauthorized", "unauthorized", c, "workspace_access_event.unauthorized", "", "warning",
		))
	}
	var input recordRequest
	if err := c.BodyParser(&input); err != nil {
		return invalidEvent(c)
	}
	entryID, err := uuid.Parse(input.EntryID)
	if err != nil || (input.Workspace != string(workspaceaccesseventdomain.WorkspaceApp) && input.Workspace != string(workspaceaccesseventdomain.WorkspacePlatform)) {
		return invalidEvent(c)
	}

	event, created, err := h.service.RecordByAuthUserID(c.UserContext(), authUserID, workspaceaccesseventdomain.RecordInput{
		EntryID: entryID, Workspace: workspaceaccesseventdomain.Workspace(input.Workspace),
	})
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "workspace_access_event.user.not_provisioned", "", "warning",
		))
	}
	if errors.Is(err, application.ErrWorkspaceAccessForbidden) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"You are not permitted to enter this workspace", "workspace_forbidden", c, "workspace_access_event.forbidden", "", "warning",
		))
	}
	if errors.Is(err, workspaceaccesseventdomain.ErrInvalidEvent) {
		return invalidEvent(c)
	}
	if err != nil {
		log.Printf("workspace_access_event_record_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, http.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "workspace_access_event.record.failed", "", "error",
		))
	}

	status := http.StatusCreated
	message, logEvent := "Workspace entry recorded", "workspace_access_event.recorded"
	if !created {
		status, message, logEvent = http.StatusOK, "Workspace entry already recorded", "workspace_access_event.duplicate"
	}
	return response.JSON(c, status, response.Success(accessEventResponse{
		ID: event.ID, Workspace: event.Workspace, OccurredAt: event.OccurredAt,
	}, message, c, logEvent, event.UserID.String(), "info"))
}

type recordRequest struct {
	EntryID   string `json:"entry_id"`
	Workspace string `json:"workspace"`
}

func invalidEvent(c *fiber.Ctx) error {
	return response.JSON(c, http.StatusBadRequest, response.Failure[any](
		"Invalid workspace entry", "invalid_workspace_access_event", c, "workspace_access_event.invalid", "", "warning",
	))
}
