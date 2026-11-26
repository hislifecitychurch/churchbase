package workspaceaccessevent

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

type Service interface {
	RecordByAuthUserID(context.Context, string, workspaceaccesseventdomain.RecordInput) (workspaceaccesseventdomain.Event, bool, error)
	GetAllForAdmin(context.Context, string, workspaceaccesseventdomain.GetAllFilter) (application.WorkspaceAccessHistory, error)
}

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

type accessEventResponse struct {
	ID         uuid.UUID                            `json:"id"`
	Workspace  workspaceaccesseventdomain.Workspace `json:"workspace"`
	OccurredAt time.Time                            `json:"occurred_at"`
}
