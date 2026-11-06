package softdelete

import (
	"context"
	"fmt"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
)

func softDeleteHook(next ent.Mutator) ent.Mutator {
	return ent.MutateFunc(func(ctx context.Context, mutation ent.Mutation) (ent.Value, error) {
		if !mutation.Op().Is(ent.OpDelete | ent.OpDeleteOne) {
			return next.Mutate(ctx, mutation)
		}

		softDeleteMutation, ok := mutation.(interface {
			SetOp(ent.Op)
			SetDeletedAt(time.Time)
			SetDeletedBy(string)
			SetUpdatedAt(time.Time)
			SetUpdatedBy(string)
			WhereP(...func(*sql.Selector))
			Client() *entclient.Client
		})
		if !ok {
			return nil, fmt.Errorf("soft delete: mutation %T does not support soft deletion", mutation)
		}

		now := time.Now()
		softDeleteMutation.WhereP(sql.FieldIsNull("deleted_at"))
		softDeleteMutation.SetDeletedAt(now)
		softDeleteMutation.SetUpdatedAt(now)
		if id, ok := actor.ID(ctx); ok {
			softDeleteMutation.SetDeletedBy(id)
			softDeleteMutation.SetUpdatedBy(id)
		}
		softDeleteMutation.SetOp(ent.OpUpdate)
		return softDeleteMutation.Client().Mutate(ctx, mutation)
	})
}
