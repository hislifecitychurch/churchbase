package service

import (
	"context"
	"fmt"
	"strings"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (s *Service) GetByAuthUserID(ctx context.Context, authUserID string) (userdomain.User, error) {
	if strings.TrimSpace(authUserID) == "" {
		return userdomain.User{}, fmt.Errorf("%w: Auth user ID is required", userdomain.ErrInvalidUser)
	}
	return s.repository.GetByAuthUserID(ctx, authUserID)
}
