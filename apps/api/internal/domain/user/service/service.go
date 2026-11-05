package service

import userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"

type Service struct {
	repository userdomain.Repository
}

func NewService(repository userdomain.Repository) *Service {
	return &Service{repository: repository}
}
