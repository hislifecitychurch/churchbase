package soft_delete

import (
	"context"
	"fmt"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministry"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministrymembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/userprofile"
)

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
		case *entclient.UserQuery:
			query.Where(user.DeletedAtIsNil())
		case *entclient.UserProfileQuery:
			query.Where(userprofile.DeletedAtIsNil())
		case *entclient.WorkspaceAccessEventQuery:
			// Access events are retained as immutable history, not soft-deleted.
		default:
			return nil, fmt.Errorf("soft delete: query %T has no deletion filter", query)
		}
		return next.Query(ctx, query)
	})
}
