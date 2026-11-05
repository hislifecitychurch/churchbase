package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (s *Service) Create(ctx context.Context, input userprofile.CreateInput) (userprofile.Profile, error) {
	if input.UserID == uuid.Nil {
		return userprofile.Profile{}, fmt.Errorf("%w: user ID is required", userprofile.ErrInvalidProfile)
	}
	if blank(input.FirstName) || blank(input.LastName) {
		return userprofile.Profile{}, fmt.Errorf("%w: names cannot be blank", userprofile.ErrInvalidProfile)
	}
	return s.repository.Create(ctx, input)
}

func blank(value *string) bool {
	return value != nil && strings.TrimSpace(*value) == ""
}
