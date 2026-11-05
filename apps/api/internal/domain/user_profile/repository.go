package userprofile

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, input CreateInput) (Profile, error)
	GetByUserID(ctx context.Context, userID uuid.UUID) (Profile, error)
}
