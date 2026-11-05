package userprofile

import "context"

type Repository interface {
	Create(ctx context.Context, input CreateInput) (Profile, error)
}
