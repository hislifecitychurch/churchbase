package service

import accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"

type Service struct {
	repository accesscontext.Repository
}

func NewService(repository accesscontext.Repository) *Service {
	return &Service{repository: repository}
}
