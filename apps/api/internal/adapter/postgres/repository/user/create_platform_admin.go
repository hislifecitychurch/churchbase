package user

import (
	"context"
	"fmt"

	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (r *UserRepository) CreatePlatformAdmin(ctx context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	created, err := transaction.Client(ctx, r.client).User.Create().
		SetNillableAuthUserID(input.AuthUserID).
		SetNillableFirstName(input.FirstName).
		SetNillableLastName(input.LastName).
		SetPlatformRole(entuser.PlatformRoleAdmin).
		Save(ctx)
	if err != nil {
		return userdomain.User{}, fmt.Errorf("create platform admin API user: %w", err)
	}

	role := userdomain.PlatformRoleAdmin
	return userdomain.User{
		ID:           created.ID,
		AuthUserID:   created.AuthUserID,
		FirstName:    created.FirstName,
		LastName:     created.LastName,
		PlatformRole: &role,
	}, nil
}
