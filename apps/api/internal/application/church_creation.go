package application

import (
	"context"
	"errors"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

var ErrChurchCreationForbidden = errors.New("church creation is forbidden")

type ChurchCreator interface {
	Create(context.Context, churchdomain.CreateInput) (churchdomain.Church, error)
}

type ChurchCreationService struct {
	users    UserByAuthUserID
	churches ChurchCreator
}

func NewChurchCreationService(users UserByAuthUserID, churches ChurchCreator) *ChurchCreationService {
	return &ChurchCreationService{users: users, churches: churches}
}

func (s *ChurchCreationService) CreateByAuthUserID(
	ctx context.Context,
	authUserID string,
	input churchdomain.CreateInput,
) (churchdomain.Church, error) {
	user, err := s.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return churchdomain.Church{}, err
	}
	if user.GlobalRoles == nil || *user.GlobalRoles != userdomain.GlobalRoleAdmin {
		return churchdomain.Church{}, ErrChurchCreationForbidden
	}
	return s.churches.Create(ctx, input)
}
