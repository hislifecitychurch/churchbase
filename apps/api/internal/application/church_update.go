package application

import (
	"context"
	"errors"

	"github.com/google/uuid"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

var ErrChurchUpdateForbidden = errors.New("church update is forbidden")

type ChurchUpdater interface {
	Update(context.Context, uuid.UUID, churchdomain.UpdateInput) error
}

type ChurchUpdateService struct {
	users    UserByAuthUserID
	churches ChurchUpdater
}

func NewChurchUpdateService(users UserByAuthUserID, churches ChurchUpdater) *ChurchUpdateService {
	return &ChurchUpdateService{users: users, churches: churches}
}

func (s *ChurchUpdateService) UpdateByAuthUserID(
	ctx context.Context,
	authUserID string,
	churchID uuid.UUID,
	input churchdomain.UpdateInput,
) error {
	user, err := s.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return err
	}
	if user.GlobalRoles == nil || *user.GlobalRoles != userdomain.GlobalRoleAdmin {
		return ErrChurchUpdateForbidden
	}
	return s.churches.Update(ctx, churchID, input)
}
