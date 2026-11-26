package service

import (
	"context"
	"fmt"
	"strings"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (s *Service) Create(ctx context.Context, input userdomain.CreateInput, profileDetails userprofile.Details) (userdomain.User, error) {
	if blank(input.AuthUserID) {
		return userdomain.User{}, fmt.Errorf("%w: auth user ID cannot be blank", userdomain.ErrInvalidUser)
	}
	return s.createWithProfile(ctx, input, profileDetails, s.repository.Create)
}

func blank(value *string) bool {
	return value != nil && strings.TrimSpace(*value) == ""
}
