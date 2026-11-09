package application

import (
	"context"

	"github.com/google/uuid"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
)

type AccessContextsByUserID interface {
	ListByUserID(context.Context, uuid.UUID) ([]accesscontext.Context, error)
}

type CurrentAccessContextsReader struct {
	users    UserByAuthUserID
	contexts AccessContextsByUserID
}

func NewCurrentAccessContextsReader(users UserByAuthUserID, contexts AccessContextsByUserID) *CurrentAccessContextsReader {
	return &CurrentAccessContextsReader{users: users, contexts: contexts}
}

func (r *CurrentAccessContextsReader) ListByAuthUserID(ctx context.Context, authUserID string) ([]accesscontext.Context, error) {
	user, err := r.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return nil, err
	}
	return r.contexts.ListByUserID(ctx, user.ID)
}
