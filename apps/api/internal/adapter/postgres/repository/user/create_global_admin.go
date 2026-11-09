package user

import (
	"context"
	"fmt"

	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (r *UserRepository) CreateGlobalAdmin(ctx context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	created, err := transaction.Client(ctx, r.client).User.Create().
		SetNillableAuthUserID(input.AuthUserID).
		SetGlobalRoles(entuser.GlobalRolesAdmin).
		Save(ctx)
	if err != nil {
		return userdomain.User{}, fmt.Errorf("create global admin API user: %w", err)
	}

	role := userdomain.GlobalRoleAdmin
	return userdomain.User{
		ID:          created.ID,
		AuthUserID:  created.AuthUserID,
		GlobalRoles: &role,
	}, nil
}
