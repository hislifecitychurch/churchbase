package service

import (
	"context"
	"fmt"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (s *Service) CreatePlatformAdmin(ctx context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	if input.AuthUserID == nil || blank(input.AuthUserID) {
		return userdomain.User{}, fmt.Errorf("%w: platform admin requires an Auth user ID", userdomain.ErrInvalidUser)
	}
	if blank(input.FirstName) {
		return userdomain.User{}, fmt.Errorf("%w: first name cannot be blank", userdomain.ErrInvalidUser)
	}
	if blank(input.LastName) {
		return userdomain.User{}, fmt.Errorf("%w: last name cannot be blank", userdomain.ErrInvalidUser)
	}

	return s.repository.CreatePlatformAdmin(ctx, input)
}
