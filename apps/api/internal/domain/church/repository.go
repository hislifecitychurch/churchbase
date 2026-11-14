package church

import "context"

type Repository interface {
	Create(context.Context, CreateInput) (Church, error)
	List(context.Context) ([]Church, error)
}
