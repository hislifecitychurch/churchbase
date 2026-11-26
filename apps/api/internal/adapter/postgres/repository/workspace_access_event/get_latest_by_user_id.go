package workspaceaccessevent

import (
	"context"
	"fmt"

	dialectsql "entgo.io/ent/dialect/sql"
	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entworkspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/ent/workspaceaccessevent"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func (r *WorkspaceAccessEventRepository) GetLatestByUserID(ctx context.Context, userID uuid.UUID) (workspaceaccesseventdomain.Event, error) {
	record, err := transaction.Client(ctx, r.client).WorkspaceAccessEvent.Query().
		Where(entworkspaceaccessevent.UserID(userID)).
		Order(func(selector *dialectsql.Selector) {
			selector.OrderBy(dialectsql.Desc(entworkspaceaccessevent.FieldOccurredAt), dialectsql.Desc(entworkspaceaccessevent.FieldID))
		}).
		First(ctx)
	if entclient.IsNotFound(err) {
		return workspaceaccesseventdomain.Event{}, workspaceaccesseventdomain.ErrEventNotFound
	}
	if err != nil {
		return workspaceaccesseventdomain.Event{}, fmt.Errorf("get latest workspace access event: %w", err)
	}
	return toDomain(record), nil
}
