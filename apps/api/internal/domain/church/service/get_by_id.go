package service

import (
	"context"

	"github.com/google/uuid"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (s *Service) GetByID(ctx context.Context, id uuid.UUID) (churchdomain.Church, error) {
	return s.repository.GetByID(ctx, id)
}
