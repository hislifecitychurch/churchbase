package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func (s *Service) GetLatestByUserID(ctx context.Context, userID uuid.UUID) (workspaceaccessevent.Event, error) {
	if userID == uuid.Nil {
		return workspaceaccessevent.Event{}, fmt.Errorf("%w: user ID is required", workspaceaccessevent.ErrInvalidEvent)
	}
	return s.repository.GetLatestByUserID(ctx, userID)
}
