package workspaceaccessevent

import (
	"context"
	"fmt"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/predicate"
	entworkspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/ent/workspaceaccessevent"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func (r *WorkspaceAccessEventRepository) Create(
	ctx context.Context,
	input workspaceaccesseventdomain.RecordInput,
) (workspaceaccesseventdomain.Event, bool, error) {
	client := transaction.Client(ctx, r.client)
	where := []predicate.WorkspaceAccessEvent{
		entworkspaceaccessevent.UserID(input.UserID),
		entworkspaceaccessevent.WorkspaceEQ(entworkspaceaccessevent.Workspace(input.Workspace)),
		entworkspaceaccessevent.EntryID(input.EntryID),
	}
	existing, err := client.WorkspaceAccessEvent.Query().Where(where...).Only(ctx)
	if err == nil {
		return toDomain(existing), false, nil
	}
	if !entclient.IsNotFound(err) {
		return workspaceaccesseventdomain.Event{}, false, fmt.Errorf("check workspace access event: %w", err)
	}

	record, err := client.WorkspaceAccessEvent.Create().
		SetUserID(input.UserID).
		SetEntryID(input.EntryID).
		SetWorkspace(entworkspaceaccessevent.Workspace(input.Workspace)).
		Save(ctx)
	if err == nil {
		return toDomain(record), true, nil
	}
	if entclient.IsConstraintError(err) {
		existing, lookupErr := client.WorkspaceAccessEvent.Query().Where(where...).Only(ctx)
		if lookupErr == nil {
			return toDomain(existing), false, nil
		}
	}
	return workspaceaccesseventdomain.Event{}, false, fmt.Errorf("create workspace access event: %w", err)
}
