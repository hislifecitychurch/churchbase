package user

import (
	"context"
	"fmt"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (r *UserRepository) GetByAuthUserID(ctx context.Context, authUserID string) (userdomain.User, error) {
	record, err := transaction.Client(ctx, r.client).User.Query().Where(entuser.AuthUserID(authUserID)).Only(ctx)
	if entclient.IsNotFound(err) {
		return userdomain.User{}, userdomain.ErrUserNotFound
	}
	if err != nil {
		return userdomain.User{}, fmt.Errorf("get API user by Auth user ID: %w", err)
	}

	var platformRole *userdomain.PlatformRole
	if record.PlatformRole != nil {
		role := userdomain.PlatformRole(*record.PlatformRole)
		platformRole = &role
	}
	return userdomain.User{
		ID:           record.ID,
		AuthUserID:   record.AuthUserID,
		PlatformRole: platformRole,
	}, nil
}
