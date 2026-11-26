package workspaceaccessevent_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
	workspaceaccesshandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/workspace_access_event"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestRecordRequiresActorAndAcceptsEntryEvent(t *testing.T) {
	userID, entryID := uuid.New(), uuid.New()
	service := &workspaceAccessServiceFake{recordResult: workspaceaccessevent.Event{
		ID: uuid.New(), UserID: userID, EntryID: entryID, Workspace: workspaceaccessevent.WorkspaceApp,
		OccurredAt: time.Date(2026, time.January, 2, 3, 4, 5, 0, time.UTC),
	}, created: true}
	app := fiber.New()
	handler := workspaceaccesshandler.NewHandler(service)
	app.Post("/events", handler.Record)

	unauthenticated, err := app.Test(httptest.NewRequest(http.MethodPost, "/events", strings.NewReader(`{"workspace":"app","entry_id":"`+entryID.String()+`"}`)))
	if err != nil {
		t.Fatal(err)
	}
	defer unauthenticated.Body.Close()
	if unauthenticated.StatusCode != http.StatusUnauthorized || service.recordCalled {
		t.Fatalf("unauthenticated response = %d; service called = %t", unauthenticated.StatusCode, service.recordCalled)
	}

	app = fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.SetUserContext(actor.WithID(c.UserContext(), "auth-user-1"))
		return c.Next()
	})
	app.Post("/events", handler.Record)
	request := httptest.NewRequest(http.MethodPost, "/events", strings.NewReader(`{"workspace":"app","entry_id":"`+entryID.String()+`"}`))
	request.Header.Set("Content-Type", "application/json")
	created, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer created.Body.Close()
	var payload response.Envelope[struct {
		ID        string `json:"id"`
		Workspace string `json:"workspace"`
	}]
	if err := json.NewDecoder(created.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if created.StatusCode != http.StatusCreated || !payload.Success || payload.Data.Workspace != "app" || service.recordInput.UserID != uuid.Nil || service.recordInput.EntryID != entryID || service.authUserID != "auth-user-1" {
		t.Fatalf("response = %d %+v; service input = %+v", created.StatusCode, payload, service.recordInput)
	}
}

func TestRecordMapsInvalidAndForbiddenInputs(t *testing.T) {
	service := &workspaceAccessServiceFake{recordErr: application.ErrWorkspaceAccessForbidden}
	app := appWithActor(workspaceaccesshandler.NewHandler(service))
	request := httptest.NewRequest(http.MethodPost, "/events", strings.NewReader(`{"workspace":"platform","entry_id":"`+uuid.NewString()+`"}`))
	request.Header.Set("Content-Type", "application/json")
	forbidden, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer forbidden.Body.Close()
	if forbidden.StatusCode != http.StatusForbidden {
		t.Fatalf("forbidden status = %d, want 403", forbidden.StatusCode)
	}
	service.recordCalled = false

	invalidRequest := httptest.NewRequest(http.MethodPost, "/events", strings.NewReader(`{"workspace":"unknown","entry_id":"invalid"}`))
	invalidRequest.Header.Set("Content-Type", "application/json")
	invalid, err := app.Test(invalidRequest)
	if err != nil {
		t.Fatal(err)
	}
	defer invalid.Body.Close()
	if invalid.StatusCode != http.StatusBadRequest || service.recordCalled {
		t.Fatalf("invalid response = %d; service called = %t", invalid.StatusCode, service.recordCalled)
	}
}

func TestGetAllForAdminValidatesFiltersAndReturnsPagination(t *testing.T) {
	userID := uuid.New()
	service := &workspaceAccessServiceFake{history: application.WorkspaceAccessHistory{
		Events: []application.WorkspaceAccessRecord{{
			Event: workspaceaccessevent.Event{
				ID: uuid.New(), UserID: userID, Workspace: workspaceaccessevent.WorkspaceApp,
				OccurredAt: time.Date(2026, time.January, 2, 3, 4, 5, 0, time.UTC),
			},
			Profile: &userprofile.Profile{UserID: userID, FirstName: stringPtr("Ada")},
		}},
		Total: 31,
	}}
	app := appWithActor(workspaceaccesshandler.NewHandler(service))
	request := httptest.NewRequest(http.MethodGet, "/events?page=2&limit=10&workspace=app&since=2026-01-01T00:00:00Z", nil)
	gotAll, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer gotAll.Body.Close()
	var payload response.Envelope[[]struct {
		UserID    string  `json:"user_id"`
		FirstName *string `json:"first_name"`
	}]
	if err := json.NewDecoder(gotAll.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if gotAll.StatusCode != http.StatusOK || payload.Pagination == nil || payload.Pagination.Page != 2 || payload.Pagination.Pages != 4 || len(payload.Data) != 1 || payload.Data[0].UserID != userID.String() || payload.Data[0].FirstName == nil || *payload.Data[0].FirstName != "Ada" || !service.getAllCalled {
		t.Fatalf("response = %d %+v", gotAll.StatusCode, payload)
	}

	invalid, err := app.Test(httptest.NewRequest(http.MethodGet, "/events?limit=101", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer invalid.Body.Close()
	if invalid.StatusCode != http.StatusBadRequest {
		t.Fatalf("invalid filter status = %d, want 400", invalid.StatusCode)
	}
}

func TestGetAllForAdminMapsForbidden(t *testing.T) {
	service := &workspaceAccessServiceFake{getAllErr: application.ErrWorkspaceAccessForbidden}
	app := appWithActor(workspaceaccesshandler.NewHandler(service))
	gotAll, err := app.Test(httptest.NewRequest(http.MethodGet, "/events", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer gotAll.Body.Close()
	if gotAll.StatusCode != http.StatusForbidden {
		t.Fatalf("forbidden status = %d, want 403", gotAll.StatusCode)
	}
}

func appWithActor(handler *workspaceaccesshandler.Handler) *fiber.App {
	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.SetUserContext(actor.WithID(c.UserContext(), "auth-user-1"))
		return c.Next()
	})
	app.Post("/events", handler.Record)
	app.Get("/events", handler.GetAllForAdmin)
	return app
}

func stringPtr(value string) *string { return &value }

type workspaceAccessServiceFake struct {
	authUserID   string
	recordCalled bool
	getAllCalled bool
	recordInput  workspaceaccessevent.RecordInput
	recordResult workspaceaccessevent.Event
	created      bool
	recordErr    error
	history      application.WorkspaceAccessHistory
	getAllErr    error
}

func (s *workspaceAccessServiceFake) RecordByAuthUserID(_ context.Context, authUserID string, input workspaceaccessevent.RecordInput) (workspaceaccessevent.Event, bool, error) {
	s.authUserID, s.recordCalled, s.recordInput = authUserID, true, input
	return s.recordResult, s.created, s.recordErr
}

func (s *workspaceAccessServiceFake) GetAllForAdmin(_ context.Context, authUserID string, _ workspaceaccessevent.GetAllFilter) (application.WorkspaceAccessHistory, error) {
	s.authUserID, s.getAllCalled = authUserID, true
	return s.history, s.getAllErr
}
