package church

import "context"

type Repository interface {
	Create(context.Context, CreateInput) (Church, error)
	GetAll(context.Context) ([]Church, error)
}
