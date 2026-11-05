package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (s *Service) Create(ctx context.Context, input userprofile.CreateInput) (userprofile.Profile, error) {
	if input.UserID == uuid.Nil {
		return userprofile.Profile{}, fmt.Errorf("%w: user ID is required", userprofile.ErrInvalidProfile)
	}
	return s.repository.Create(ctx, input)
}
