package v1_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	httpv1 "github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http/v1"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	churchhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/health"
	userhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	workspaceaccesshandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/workspace_access_event"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestUsersMeRouteRequiresValidatedSession(t *testing.T) {
	role := userdomain.GlobalRoleStaff
	app := fiber.New()
	httpv1.Register(
		app.Group("/api/v1"),
		health.New(),
		sessionValidatorFake{},
		userhandler.NewHandler(currentUserFake{current: application.CurrentUser{
			User:    userdomain.User{ID: uuid.New(), GlobalRoles: &role},
			Profile: userprofile.Profile{},
		}}, accessContextsFake{}),
		workspaceaccesshandler.NewHandler(nil),
		churchhandler.NewHandler(churchCreatorFake{}, churchListerFake{}),
	)

	unauthenticated, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer unauthenticated.Body.Close()
	if unauthenticated.StatusCode != http.StatusUnauthorized {
		t.Fatalf("unauthenticated /users/me status = %d, want 401", unauthenticated.StatusCode)
	}
	unauthenticated.Body.Close()
	for _, endpoint := range []struct {
		method string
		path   string
	}{
		{method: http.MethodGet, path: "/api/v1/users/me/access-contexts"},
		{method: http.MethodPost, path: "/api/v1/users/me/workspace-access-events"},
		{method: http.MethodGet, path: "/api/v1/platform/churches"},
		{method: http.MethodPost, path: "/api/v1/platform/churches"},
		{method: http.MethodGet, path: "/api/v1/platform/workspace-access-events"},
	} {
		response, err := app.Test(httptest.NewRequest(endpoint.method, endpoint.path, nil))
		if err != nil {
			t.Fatal(err)
		}
		response.Body.Close()
		if response.StatusCode != http.StatusUnauthorized {
			t.Fatalf("unauthenticated %s %s status = %d, want 401", endpoint.method, endpoint.path, response.StatusCode)
		}
	}

	authenticatedRequest := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	authenticatedRequest.Header.Set("Cookie", "session=valid")
	authenticated, err := app.Test(authenticatedRequest)
	if err != nil {
		t.Fatal(err)
	}
	defer authenticated.Body.Close()
	var body response.Envelope[struct {
		ID string `json:"id"`
	}]
	if err := json.NewDecoder(authenticated.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if authenticated.StatusCode != http.StatusOK || !body.Success || body.Data.ID == "" {
		t.Fatalf("authenticated /users/me response = %d %+v", authenticated.StatusCode, body)
	}

	contextsRequest := httptest.NewRequest(http.MethodGet, "/api/v1/users/me/access-contexts", nil)
	contextsRequest.Header.Set("Cookie", "session=valid")
	contextsResponse, err := app.Test(contextsRequest)
	if err != nil {
		t.Fatal(err)
	}
	defer contextsResponse.Body.Close()
	if contextsResponse.StatusCode != http.StatusOK {
		t.Fatalf("authenticated /users/me/access-contexts status = %d", contextsResponse.StatusCode)
	}
}

type churchCreatorFake struct{}

func (churchCreatorFake) CreateByAuthUserID(context.Context, string, churchdomain.CreateInput) (churchdomain.Church, error) {
	return churchdomain.Church{}, nil
}

type churchListerFake struct{}

func (churchListerFake) ListByAuthUserID(context.Context, string) ([]churchdomain.Church, error) {
	return nil, nil
}

type sessionValidatorFake struct{}

func (sessionValidatorFake) Validate(context.Context, string, string) (string, bool, error) {
	return "auth-user-1", true, nil
}

type currentUserFake struct {
	current application.CurrentUser
}

func (s currentUserFake) GetByAuthUserID(context.Context, string) (application.CurrentUser, error) {
	return s.current, nil
}

type accessContextsFake struct{}

func (accessContextsFake) ListByAuthUserID(context.Context, string) (application.CurrentAccessContexts, error) {
	return application.CurrentAccessContexts{Contexts: []accesscontext.Context{}}, nil
}
