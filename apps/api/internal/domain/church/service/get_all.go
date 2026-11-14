package service

import (
	"context"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (s *Service) GetAll(ctx context.Context) ([]churchdomain.Church, error) {
	return s.repository.GetAll(ctx)
}
