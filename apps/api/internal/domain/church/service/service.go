package service

import churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"

type Service struct {
	repository churchdomain.Repository
}

func NewService(repository churchdomain.Repository) *Service {
	return &Service{repository: repository}
}
