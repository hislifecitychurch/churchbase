package workspaceaccessevent

import (
	"context"
	"fmt"

	dialectsql "entgo.io/ent/dialect/sql"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entworkspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/ent/workspaceaccessevent"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func (r *WorkspaceAccessEventRepository) GetAll(ctx context.Context, filter workspaceaccesseventdomain.GetAllFilter) (workspaceaccesseventdomain.Page, error) {
	query := transaction.Client(ctx, r.client).WorkspaceAccessEvent.Query()
	if filter.Workspace != nil {
		query.Where(entworkspaceaccessevent.WorkspaceEQ(entworkspaceaccessevent.Workspace(*filter.Workspace)))
	}
	if filter.Since != nil {
		query.Where(entworkspaceaccessevent.OccurredAtGTE(*filter.Since))
	}
	if filter.Until != nil {
		query.Where(entworkspaceaccessevent.OccurredAtLTE(*filter.Until))
	}

	total, err := query.Clone().Count(ctx)
	if err != nil {
		return workspaceaccesseventdomain.Page{}, fmt.Errorf("count workspace access events: %w", err)
	}
	records, err := query.
		Order(func(selector *dialectsql.Selector) {
			selector.OrderBy(dialectsql.Desc(entworkspaceaccessevent.FieldOccurredAt), dialectsql.Desc(entworkspaceaccessevent.FieldID))
		}).
		Offset((filter.Page - 1) * filter.Limit).
		Limit(filter.Limit).
		All(ctx)
	if err != nil {
		return workspaceaccesseventdomain.Page{}, fmt.Errorf("get all workspace access events: %w", err)
	}
	events := make([]workspaceaccesseventdomain.Event, 0, len(records))
	for _, record := range records {
		events = append(events, toDomain(record))
	}
	return workspaceaccesseventdomain.Page{Events: events, Total: total}, nil
}

func toDomain(record *entclient.WorkspaceAccessEvent) workspaceaccesseventdomain.Event {
	return workspaceaccesseventdomain.Event{
		ID:         record.ID,
		UserID:     record.UserID,
		EntryID:    record.EntryID,
		Workspace:  workspaceaccesseventdomain.Workspace(record.Workspace),
		OccurredAt: record.OccurredAt.UTC(),
	}
}
