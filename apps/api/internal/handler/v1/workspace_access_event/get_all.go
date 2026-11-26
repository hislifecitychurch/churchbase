package workspaceaccessevent

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

const (
	defaultPageSize = 25
	maxPageSize     = 100
)

func (h *Handler) GetAllForAdmin(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, http.StatusUnauthorized, response.Failure[any](
			"Unauthorized", "unauthorized", c, "workspace_access_event.unauthorized", "", "warning",
		))
	}
	filter, err := parseGetAllFilter(c)
	if err != nil {
		return response.JSON(c, http.StatusBadRequest, response.Failure[any](
			"Invalid workspace entry filters", "invalid_query_parameters", c, "workspace_access_event.filters.invalid", "", "warning",
		))
	}
	history, err := h.service.GetAllForAdmin(c.UserContext(), authUserID, filter)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "workspace_access_event.user.not_provisioned", "", "warning",
		))
	}
	if errors.Is(err, application.ErrWorkspaceAccessForbidden) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"Global administrator access is required", "forbidden", c, "workspace_access_event.get_all.forbidden", "", "warning",
		))
	}
	if errors.Is(err, workspaceaccesseventdomain.ErrInvalidEvent) {
		return response.JSON(c, http.StatusBadRequest, response.Failure[any](
			"Invalid workspace entry filters", "invalid_query_parameters", c, "workspace_access_event.filters.invalid", "", "warning",
		))
	}
	if err != nil {
		log.Printf("workspace_access_event_get_all_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, http.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "workspace_access_event.get_all.failed", "", "error",
		))
	}

	items := make([]historyEventResponse, 0, len(history.Events))
	for _, record := range history.Events {
		var firstName, lastName *string
		if record.Profile != nil {
			firstName, lastName = record.Profile.FirstName, record.Profile.LastName
		}
		items = append(items, historyEventResponse{
			ID: record.Event.ID, UserID: record.Event.UserID, FirstName: firstName, LastName: lastName,
			Workspace: record.Event.Workspace, OccurredAt: record.Event.OccurredAt,
		})
	}
	pages := (history.Total + filter.Limit - 1) / filter.Limit
	payload := response.Success(items, "Workspace access history retrieved", c, "workspace_access_event.retrieved", "", "info")
	payload.Filters = map[string]any{
		"workspace": filter.Workspace,
		"since":     filter.Since,
		"until":     filter.Until,
	}
	payload.Pagination = &response.Pagination{
		Page: filter.Page, Items: len(items), Total: history.Total, Pages: pages, Limit: filter.Limit,
		HasNext: filter.Page < pages, HasPrev: filter.Page > 1,
	}
	return response.JSON(c, http.StatusOK, payload)
}

type historyEventResponse struct {
	ID         uuid.UUID                            `json:"id"`
	UserID     uuid.UUID                            `json:"user_id"`
	FirstName  *string                              `json:"first_name"`
	LastName   *string                              `json:"last_name"`
	Workspace  workspaceaccesseventdomain.Workspace `json:"workspace"`
	OccurredAt time.Time                            `json:"occurred_at"`
}

func parseGetAllFilter(c *fiber.Ctx) (workspaceaccesseventdomain.GetAllFilter, error) {
	page, err := queryInt(c, "page", 1, 1_000_000)
	if err != nil {
		return workspaceaccesseventdomain.GetAllFilter{}, err
	}
	limit, err := queryInt(c, "limit", defaultPageSize, maxPageSize)
	if err != nil {
		return workspaceaccesseventdomain.GetAllFilter{}, err
	}
	filter := workspaceaccesseventdomain.GetAllFilter{Page: page, Limit: limit}
	if value := c.Query("workspace"); value != "" {
		workspace := workspaceaccesseventdomain.Workspace(value)
		if workspace != workspaceaccesseventdomain.WorkspaceApp && workspace != workspaceaccesseventdomain.WorkspacePlatform {
			return workspaceaccesseventdomain.GetAllFilter{}, errors.New("unsupported workspace")
		}
		filter.Workspace = &workspace
	}
	if filter.Since, err = queryTime(c, "since"); err != nil {
		return workspaceaccesseventdomain.GetAllFilter{}, err
	}
	if filter.Until, err = queryTime(c, "until"); err != nil {
		return workspaceaccesseventdomain.GetAllFilter{}, err
	}
	if filter.Since != nil && filter.Until != nil && filter.Since.After(*filter.Until) {
		return workspaceaccesseventdomain.GetAllFilter{}, errors.New("since must not be after until")
	}
	return filter, nil
}

func queryInt(c *fiber.Ctx, key string, fallback, max int) (int, error) {
	value := c.Query(key)
	if value == "" {
		return fallback, nil
	}
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed < 1 || parsed > max {
		return 0, errors.New("query parameter out of range")
	}
	return parsed, nil
}

func queryTime(c *fiber.Ctx, key string) (*time.Time, error) {
	value := c.Query(key)
	if value == "" {
		return nil, nil
	}
	parsed, err := time.Parse(time.RFC3339Nano, value)
	if err != nil {
		return nil, errors.New("timestamp must be RFC3339")
	}
	return &parsed, nil
}
