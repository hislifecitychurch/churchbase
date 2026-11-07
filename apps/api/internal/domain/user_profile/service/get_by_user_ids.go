package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (s *Service) GetByUserIDs(ctx context.Context, userIDs []uuid.UUID) ([]userprofile.Profile, error) {
	for _, userID := range userIDs {
		if userID == uuid.Nil {
			return nil, fmt.Errorf("%w: user IDs must not be empty", userprofile.ErrInvalidProfile)
		}
	}
	if len(userIDs) == 0 {
		return []userprofile.Profile{}, nil
	}
	return s.repository.GetByUserIDs(ctx, userIDs)
}
