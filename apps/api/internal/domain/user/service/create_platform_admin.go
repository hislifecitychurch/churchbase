package service

import (
	"context"
	"fmt"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (s *Service) CreatePlatformAdmin(ctx context.Context, input userdomain.CreateInput, profileDetails userprofile.Details) (userdomain.User, error) {
	if input.AuthUserID == nil || blank(input.AuthUserID) {
		return userdomain.User{}, fmt.Errorf("%w: platform admin requires an Auth user ID", userdomain.ErrInvalidUser)
	}
	return s.createWithProfile(ctx, input, profileDetails, s.repository.CreatePlatformAdmin)
}
