package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
	workspaceaccesseventservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event/service"
)

func TestRecordValidatesRequiredIDsAndWorkspace(t *testing.T) {
	repository := &workspaceAccessRepositoryFake{}
	service := workspaceaccesseventservice.NewService(repository)
	inputs := []workspaceaccessevent.RecordInput{
		{EntryID: uuid.New(), Workspace: workspaceaccessevent.WorkspaceApp},
		{UserID: uuid.New(), Workspace: workspaceaccessevent.WorkspaceApp},
		{UserID: uuid.New(), EntryID: uuid.New(), Workspace: "invalid"},
	}
	for _, input := range inputs {
		if _, _, err := service.Record(context.Background(), input); !errors.Is(err, workspaceaccessevent.ErrInvalidEvent) {
			t.Fatalf("Record(%+v) error = %v, want invalid event", input, err)
		}
	}
	if repository.createCalled {
		t.Fatal("repository called with invalid event")
	}
}

func TestListRejectsOutOfRangePagination(t *testing.T) {
	repository := &workspaceAccessRepositoryFake{}
	service := workspaceaccesseventservice.NewService(repository)
	for _, filter := range []workspaceaccessevent.ListFilter{
		{Page: 0, Limit: 25},
		{Page: 1, Limit: workspaceaccesseventservice.MaxPageSize + 1},
		{Page: 1_000_001, Limit: 25},
	} {
		if _, err := service.List(context.Background(), filter); !errors.Is(err, workspaceaccessevent.ErrInvalidEvent) {
			t.Fatalf("List(%+v) error = %v, want invalid event", filter, err)
		}
	}
	if repository.listCalled {
		t.Fatal("repository called with invalid pagination")
	}
}

type workspaceAccessRepositoryFake struct {
	createCalled bool
	listCalled   bool
}

func (r *workspaceAccessRepositoryFake) Create(_ context.Context, input workspaceaccessevent.RecordInput) (workspaceaccessevent.Event, bool, error) {
	r.createCalled = true
	return workspaceaccessevent.Event{UserID: input.UserID, EntryID: input.EntryID, Workspace: input.Workspace}, true, nil
}

func (*workspaceAccessRepositoryFake) GetLatestByUserID(context.Context, uuid.UUID) (workspaceaccessevent.Event, error) {
	return workspaceaccessevent.Event{}, workspaceaccessevent.ErrEventNotFound
}

func (r *workspaceAccessRepositoryFake) List(context.Context, workspaceaccessevent.ListFilter) (workspaceaccessevent.Page, error) {
	r.listCalled = true
	return workspaceaccessevent.Page{}, nil
}
