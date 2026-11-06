package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (s *Service) GetByUserID(ctx context.Context, userID uuid.UUID) (userprofile.Profile, error) {
	if userID == uuid.Nil {
		return userprofile.Profile{}, fmt.Errorf("%w: user ID is required", userprofile.ErrInvalidProfile)
	}
	return s.repository.GetByUserID(ctx, userID)
}
