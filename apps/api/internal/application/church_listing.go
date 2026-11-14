package application

import (
	"context"
	"errors"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

var ErrChurchListingForbidden = errors.New("church listing is forbidden")

type ChurchLister interface {
	List(context.Context) ([]churchdomain.Church, error)
}

type ChurchListingService struct {
	users    UserByAuthUserID
	churches ChurchLister
}

func NewChurchListingService(users UserByAuthUserID, churches ChurchLister) *ChurchListingService {
	return &ChurchListingService{users: users, churches: churches}
}

func (s *ChurchListingService) ListByAuthUserID(ctx context.Context, authUserID string) ([]churchdomain.Church, error) {
	user, err := s.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return nil, err
	}
	if !hasGlobalRole(user) {
		return nil, ErrChurchListingForbidden
	}
	return s.churches.List(ctx)
}
