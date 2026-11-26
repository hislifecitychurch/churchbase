package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func (s *Service) Record(ctx context.Context, input workspaceaccessevent.RecordInput) (workspaceaccessevent.Event, bool, error) {
	if input.UserID == uuid.Nil || input.EntryID == uuid.Nil ||
		(input.Workspace != workspaceaccessevent.WorkspaceApp && input.Workspace != workspaceaccessevent.WorkspacePlatform) {
		return workspaceaccessevent.Event{}, false, fmt.Errorf("%w: user, entry ID, and supported workspace are required", workspaceaccessevent.ErrInvalidEvent)
	}
	return s.repository.Create(ctx, input)
}
