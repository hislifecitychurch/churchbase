package service

import (
	"context"
	"fmt"
	"strings"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (s *Service) Create(ctx context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	if blank(input.AuthUserID) {
		return userdomain.User{}, fmt.Errorf("%w: auth user ID cannot be blank", userdomain.ErrInvalidUser)
	}
	if blank(input.FirstName) {
		return userdomain.User{}, fmt.Errorf("%w: first name cannot be blank", userdomain.ErrInvalidUser)
	}
	if blank(input.LastName) {
		return userdomain.User{}, fmt.Errorf("%w: last name cannot be blank", userdomain.ErrInvalidUser)
	}

	return s.repository.Create(ctx, input)
}

func blank(value *string) bool {
	return value != nil && strings.TrimSpace(*value) == ""
}
