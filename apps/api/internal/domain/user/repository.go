package user

import "context"

type Repository interface {
	Create(ctx context.Context, input CreateInput) (User, error)
	CreatePlatformAdmin(ctx context.Context, input CreateInput) (User, error)
	GetByAuthUserID(ctx context.Context, authUserID string) (User, error)
}
