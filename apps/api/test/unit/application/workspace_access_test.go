package application_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func TestWorkspaceAccessRecordsAnyProvisionedUserForApp(t *testing.T) {
	userID := uuid.New()
	entryID := uuid.New()
	users := &workspaceAccessUserReader{result: userdomain.User{ID: userID}}
	events := &workspaceAccessEventsFake{created: true}
	service := application.NewWorkspaceAccessService(users, events, workspaceProfilesFake{})

	recorded, created, err := service.RecordByAuthUserID(context.Background(), "auth-user-1", workspaceaccessevent.RecordInput{
		EntryID:   entryID,
		Workspace: workspaceaccessevent.WorkspaceApp,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !created || events.recordInput.UserID != userID || recorded.UserID != userID || recorded.EntryID != entryID || users.authUserID != "auth-user-1" {
		t.Fatalf("recorded = %+v, created = %t, input = %+v, auth user = %q", recorded, created, events.recordInput, users.authUserID)
	}
}

func TestWorkspaceAccessRejectsPlatformEntryWithoutGlobalRole(t *testing.T) {
	events := &workspaceAccessEventsFake{}
	service := application.NewWorkspaceAccessService(
		&workspaceAccessUserReader{result: userdomain.User{ID: uuid.New()}},
		events,
		workspaceProfilesFake{},
	)

	_, _, err := service.RecordByAuthUserID(context.Background(), "auth-user-1", workspaceaccessevent.RecordInput{
		EntryID:   uuid.New(),
		Workspace: workspaceaccessevent.WorkspacePlatform,
	})
	if !errors.Is(err, application.ErrWorkspaceAccessForbidden) || events.recordCalled {
		t.Fatalf("RecordByAuthUserID error = %v, record called = %t", err, events.recordCalled)
	}
}

func TestWorkspaceAccessHistoryIsAdminOnlyAndIncludesProfileNames(t *testing.T) {
	userID := uuid.New()
	role := userdomain.GlobalRoleAdmin
	occurredAt := time.Date(2026, time.January, 2, 3, 4, 5, 0, time.UTC)
	event := workspaceaccessevent.Event{ID: uuid.New(), UserID: userID, Workspace: workspaceaccessevent.WorkspaceApp, OccurredAt: occurredAt}
	users := &workspaceAccessUserReader{result: userdomain.User{ID: uuid.New(), GlobalRoles: &role}}
	profiles := workspaceProfilesFake{profiles: []userprofile.Profile{{UserID: userID, FirstName: workspaceAccessStringPointer("Ada"), LastName: workspaceAccessStringPointer("Lovelace")}}}
	events := &workspaceAccessEventsFake{page: workspaceaccessevent.Page{Events: []workspaceaccessevent.Event{event}, Total: 1}}
	service := application.NewWorkspaceAccessService(users, events, profiles)

	history, err := service.GetAllForAdmin(context.Background(), "auth-admin", workspaceaccessevent.GetAllFilter{Page: 1, Limit: 25})
	if err != nil {
		t.Fatal(err)
	}
	if len(history.Events) != 1 || history.Total != 1 || history.Events[0].Event.ID != event.ID || history.Events[0].Profile == nil || history.Events[0].Profile.FirstName == nil || *history.Events[0].Profile.FirstName != "Ada" {
		t.Fatalf("history = %+v", history)
	}

	role = userdomain.GlobalRoleStaff
	if _, err := service.GetAllForAdmin(context.Background(), "auth-staff", workspaceaccessevent.GetAllFilter{Page: 1, Limit: 25}); !errors.Is(err, application.ErrWorkspaceAccessForbidden) {
		t.Fatalf("staff GetAllForAdmin error = %v, want forbidden", err)
	}
}

func workspaceAccessStringPointer(value string) *string { return &value }

type workspaceAccessUserReader struct {
	authUserID string
	result     userdomain.User
	err        error
}

func (r *workspaceAccessUserReader) GetByAuthUserID(_ context.Context, authUserID string) (userdomain.User, error) {
	r.authUserID = authUserID
	return r.result, r.err
}

type workspaceAccessEventsFake struct {
	recordCalled bool
	recordInput  workspaceaccessevent.RecordInput
	recordResult workspaceaccessevent.Event
	created      bool
	page         workspaceaccessevent.Page
	err          error
}

func (r *workspaceAccessEventsFake) Record(_ context.Context, input workspaceaccessevent.RecordInput) (workspaceaccessevent.Event, bool, error) {
	r.recordCalled, r.recordInput = true, input
	if r.recordResult.ID == uuid.Nil {
		r.recordResult = workspaceaccessevent.Event{ID: uuid.New(), UserID: input.UserID, EntryID: input.EntryID, Workspace: input.Workspace}
	}
	return r.recordResult, r.created, r.err
}

func (r *workspaceAccessEventsFake) GetAll(context.Context, workspaceaccessevent.GetAllFilter) (workspaceaccessevent.Page, error) {
	return r.page, r.err
}

type workspaceProfilesFake struct {
	profiles []userprofile.Profile
	err      error
}

func (r workspaceProfilesFake) GetByUserIDs(context.Context, []uuid.UUID) ([]userprofile.Profile, error) {
	return r.profiles, r.err
}
