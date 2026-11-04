package postgres

import (
	"context"
	"fmt"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministry"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministrymembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
)

func ConfigureClient(client *entclient.Client) {
	client.Use(softDeleteHook)
	client.Intercept(entclient.InterceptFunc(softDeleteInterceptor))
}

func softDeleteInterceptor(next entclient.Querier) entclient.Querier {
	return entclient.QuerierFunc(func(ctx context.Context, query entclient.Query) (entclient.Value, error) {
		if mixin.IncludesDeleted(ctx) {
			return next.Query(ctx, query)
		}
		switch query := query.(type) {
		case *entclient.ChurchQuery:
			query.Where(church.DeletedAtIsNil())
		case *entclient.ChurchMembershipQuery:
			query.Where(churchmembership.DeletedAtIsNil())
		case *entclient.MinistryQuery:
			query.Where(ministry.DeletedAtIsNil())
		case *entclient.MinistryMembershipQuery:
			query.Where(ministrymembership.DeletedAtIsNil())
		default:
			return nil, fmt.Errorf("soft delete: query %T has no deletion filter", query)
		}
		return next.Query(ctx, query)
	})
}

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
