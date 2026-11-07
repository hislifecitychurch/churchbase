package service

import workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"

type Service struct {
	repository workspaceaccessevent.Repository
}

func NewService(repository workspaceaccessevent.Repository) *Service {
	return &Service{repository: repository}
}
