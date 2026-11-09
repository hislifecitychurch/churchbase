package application

import (
	"context"

	"github.com/google/uuid"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

type AccessContextsByUserID interface {
	ListByUserID(context.Context, uuid.UUID) ([]accesscontext.Context, error)
	ListAll(context.Context) ([]accesscontext.Context, error)
}

type CurrentAccessContexts struct {
	GlobalRoles *userdomain.GlobalRole
	Contexts    []accesscontext.Context
}

type CurrentAccessContextsReader struct {
	users    UserByAuthUserID
	contexts AccessContextsByUserID
}

func NewCurrentAccessContextsReader(users UserByAuthUserID, contexts AccessContextsByUserID) *CurrentAccessContextsReader {
	return &CurrentAccessContextsReader{users: users, contexts: contexts}
}

func (r *CurrentAccessContextsReader) ListByAuthUserID(ctx context.Context, authUserID string) (CurrentAccessContexts, error) {
	user, err := r.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return CurrentAccessContexts{}, err
	}

	if user.GlobalRoles != nil {
		contexts, err := r.contexts.ListAll(ctx)
		if err != nil {
			return CurrentAccessContexts{}, err
		}
		role := "global_" + string(*user.GlobalRoles)
		for i := range contexts {
			contexts[i].Role = role
		}
		return CurrentAccessContexts{GlobalRoles: user.GlobalRoles, Contexts: contexts}, nil
	}

	contexts, err := r.contexts.ListByUserID(ctx, user.ID)
	if err != nil {
		return CurrentAccessContexts{}, err
	}
	return CurrentAccessContexts{Contexts: contexts}, nil
}
