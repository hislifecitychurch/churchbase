package workspaceaccessevent

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	Create(context.Context, RecordInput) (Event, bool, error)
	GetLatestByUserID(context.Context, uuid.UUID) (Event, error)
	List(context.Context, ListFilter) (Page, error)
}
