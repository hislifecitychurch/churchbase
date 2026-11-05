package user

import (
	"context"
	"fmt"
	"strings"
)

type Service struct {
	repository Repository
}

func NewService(repository Repository) *Service {
	return &Service{repository: repository}
}

func (s *Service) Create(ctx context.Context, input CreateInput) (User, error) {
	if blank(input.AuthUserID) {
		return User{}, fmt.Errorf("%w: auth user ID cannot be blank", ErrInvalidUser)
	}
	if blank(input.FirstName) {
		return User{}, fmt.Errorf("%w: first name cannot be blank", ErrInvalidUser)
	}
	if blank(input.LastName) {
		return User{}, fmt.Errorf("%w: last name cannot be blank", ErrInvalidUser)
	}

	return s.repository.Create(ctx, input)
}

func blank(value *string) bool {
	return value != nil && strings.TrimSpace(*value) == ""
}
