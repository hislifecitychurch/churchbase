package user

import (
	"context"
	"fmt"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (r *UserRepository) Create(ctx context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	created, err := transaction.Client(ctx, r.client).User.Create().
		SetNillableAuthUserID(input.AuthUserID).
		Save(ctx)
	if err != nil {
		return userdomain.User{}, fmt.Errorf("create API user: %w", err)
	}

	return userdomain.User{ID: created.ID, AuthUserID: created.AuthUserID}, nil
}
