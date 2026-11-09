package access_context

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]MembershipContext, error)
}
