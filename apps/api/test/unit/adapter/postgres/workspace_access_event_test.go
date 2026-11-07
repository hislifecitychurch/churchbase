package postgres_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/enttest"
	entworkspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/ent/workspaceaccessevent"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/actions/soft_delete"
	workspaceaccesseventrepository "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/repository/workspace_access_event"
	workspaceaccesseventdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
	_ "github.com/mattn/go-sqlite3"
)

func TestWorkspaceAccessEventRepositoryDeduplicatesEntry(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:workspace-access-event-idempotency?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	owner, err := client.User.Create().Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	input := workspaceaccesseventdomain.RecordInput{
		UserID: owner.ID, EntryID: uuid.New(), Workspace: workspaceaccesseventdomain.WorkspaceApp,
	}
	repository := workspaceaccesseventrepository.NewWorkspaceAccessEventRepository(client)
	created, inserted, err := repository.Create(context.Background(), input)
	if err != nil {
		t.Fatal(err)
	}
	if !inserted {
		t.Fatal("first entry was not inserted")
	}
	if created.OccurredAt.Location() != time.UTC {
		t.Fatalf("occurred_at location = %s, want UTC", created.OccurredAt.Location())
	}
	duplicate, inserted, err := repository.Create(context.Background(), input)
	if err != nil {
		t.Fatal(err)
	}
	if inserted || duplicate.ID != created.ID {
		t.Fatalf("duplicate = %+v, inserted = %t; first = %+v", duplicate, inserted, created)
	}
	count, err := client.WorkspaceAccessEvent.Query().Count(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if count != 1 {
		t.Fatalf("event count = %d, want 1", count)
	}
}

func TestWorkspaceAccessEventRepositoryListsNewestFirstAndFilters(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:workspace-access-event-list?mode=memory&cache=shared&_fk=1")
	defer client.Close()
	soft_delete.ConfigureClient(client)

	owner, err := client.User.Create().Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	older := time.Date(2026, time.January, 1, 0, 0, 0, 0, time.UTC)
	newer := older.Add(time.Hour)
	appEvent, err := client.WorkspaceAccessEvent.Create().
		SetUserID(owner.ID).
		SetEntryID(uuid.New()).
		SetWorkspace(entworkspaceaccessevent.WorkspaceApp).
		SetOccurredAt(older).
		Save(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if _, err := client.WorkspaceAccessEvent.Create().
		SetUserID(owner.ID).
		SetEntryID(uuid.New()).
		SetWorkspace(entworkspaceaccessevent.WorkspacePlatform).
		SetOccurredAt(newer).
		Save(context.Background()); err != nil {
		t.Fatal(err)
	}

	repository := workspaceaccesseventrepository.NewWorkspaceAccessEventRepository(client)
	latest, err := repository.GetLatestByUserID(context.Background(), owner.ID)
	if err != nil {
		t.Fatal(err)
	}
	if latest.Workspace != workspaceaccesseventdomain.WorkspacePlatform || !latest.OccurredAt.Equal(newer) {
		t.Fatalf("latest event = %+v, want platform at %s", latest, newer)
	}
	workspace := workspaceaccesseventdomain.WorkspaceApp
	page, err := repository.List(context.Background(), workspaceaccesseventdomain.ListFilter{
		Workspace: &workspace, Since: &older, Page: 1, Limit: 10,
	})
	if err != nil {
		t.Fatal(err)
	}
	if page.Total != 1 || len(page.Events) != 1 || page.Events[0].ID != appEvent.ID {
		t.Fatalf("filtered page = %+v, want only app event %s", page, appEvent.ID)
	}
}
