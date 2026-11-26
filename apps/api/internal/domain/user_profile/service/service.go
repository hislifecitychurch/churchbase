package service

import userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"

type Service struct {
	repository userprofile.Repository
}

func NewService(repository userprofile.Repository) *Service {
	return &Service{repository: repository}
}
