package church

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	Create(context.Context, CreateInput) (Church, error)
	Update(context.Context, uuid.UUID, UpdateInput) error
	GetAll(context.Context) ([]Church, error)
}
