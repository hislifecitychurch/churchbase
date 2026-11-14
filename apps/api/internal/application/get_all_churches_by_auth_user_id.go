package application

import (
	"context"
	"errors"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

var ErrChurchDirectoryForbidden = errors.New("church directory access is forbidden")

type ChurchGetter interface {
	GetAll(context.Context) ([]churchdomain.Church, error)
}

type ChurchDirectoryService struct {
	users    UserByAuthUserID
	churches ChurchGetter
}

func NewChurchDirectoryService(users UserByAuthUserID, churches ChurchGetter) *ChurchDirectoryService {
	return &ChurchDirectoryService{users: users, churches: churches}
}

func (s *ChurchDirectoryService) GetAllByAuthUserID(ctx context.Context, authUserID string) ([]churchdomain.Church, error) {
	user, err := s.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return nil, err
	}
	if !hasGlobalRole(user) {
		return nil, ErrChurchDirectoryForbidden
	}
	return s.churches.GetAll(ctx)
}
