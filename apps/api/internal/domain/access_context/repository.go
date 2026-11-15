package access_context

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]MembershipContext, error)
	GetAll(ctx context.Context) ([]MembershipContext, error)
}
