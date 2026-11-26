package service

import (
	"context"
	"fmt"

	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

const MaxPageSize = 100

func (s *Service) GetAll(ctx context.Context, filter workspaceaccessevent.GetAllFilter) (workspaceaccessevent.Page, error) {
	if filter.Page < 1 || filter.Page > 1_000_000 || filter.Limit < 1 || filter.Limit > MaxPageSize {
		return workspaceaccessevent.Page{}, fmt.Errorf("%w: page and limit are out of range", workspaceaccessevent.ErrInvalidEvent)
	}
	if filter.Workspace != nil && *filter.Workspace != workspaceaccessevent.WorkspaceApp && *filter.Workspace != workspaceaccessevent.WorkspacePlatform {
		return workspaceaccessevent.Page{}, fmt.Errorf("%w: unsupported workspace", workspaceaccessevent.ErrInvalidEvent)
	}
	if filter.Since != nil && filter.Until != nil && filter.Since.After(*filter.Until) {
		return workspaceaccessevent.Page{}, fmt.Errorf("%w: since must not be after until", workspaceaccessevent.ErrInvalidEvent)
	}
	return s.repository.GetAll(ctx, filter)
}
