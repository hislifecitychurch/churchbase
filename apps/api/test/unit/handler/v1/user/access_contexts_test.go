package user_test

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	apiresponse "github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestHandlerGetAccessContextsReturnsServerComputedContexts(t *testing.T) {
	contextID, churchID := uuid.New(), uuid.New()
	service := &accessContextsServiceFake{result: []accesscontext.Context{{
		ID: contextID, ChurchID: churchID, Kind: accesscontext.KindChurch, Slug: "churchbase",
		Name: "Church-wide", ChurchName: "Sample Church", Role: "staff",
		Capabilities: []string{accesscontext.CapabilityChurchOverviewRead, accesscontext.CapabilityChurchPeopleRead},
	}}}
	response := getAccessContexts(t, service, true)
	defer response.Body.Close()

	rawBody, err := io.ReadAll(response.Body)
	if err != nil {
		t.Fatal(err)
	}
	var body apiresponse.Envelope[struct {
		Contexts []struct {
			ID           string   `json:"id"`
			ChurchID     string   `json:"church_id"`
			Kind         string   `json:"kind"`
			Slug         string   `json:"slug"`
			Name         string   `json:"name"`
			ChurchName   string   `json:"church_name"`
			Role         string   `json:"role"`
			Capabilities []string `json:"capabilities"`
		} `json:"contexts"`
	}]
	if err := json.Unmarshal(rawBody, &body); err != nil {
		t.Fatal(err)
	}
	if response.StatusCode != http.StatusOK || !body.Success || len(body.Data.Contexts) != 1 {
		t.Fatalf("response = %d %+v", response.StatusCode, body)
	}
	got := body.Data.Contexts[0]
	if got.ID != contextID.String() || got.ChurchID != churchID.String() || got.Kind != "church" || got.Role != "staff" || len(got.Capabilities) != 2 {
		t.Fatalf("context = %+v", got)
	}
	if service.authUserID != "opaque-auth-id" || strings.Contains(string(rawBody), "opaque-auth-id") {
		t.Fatalf("access context lookup used/exposed unexpected Auth ID: %s", rawBody)
	}
}

func TestHandlerGetAccessContextsRejectsMissingActor(t *testing.T) {
	service := &accessContextsServiceFake{}
	response := getAccessContexts(t, service, false)
	defer response.Body.Close()
	if response.StatusCode != http.StatusUnauthorized || service.called {
		t.Fatalf("status = %d, service called = %v", response.StatusCode, service.called)
	}
}

func TestHandlerGetAccessContextsMapsMissingAPIUserToForbidden(t *testing.T) {
	response := getAccessContexts(t, &accessContextsServiceFake{err: userdomain.ErrUserNotFound}, true)
	defer response.Body.Close()
	if response.StatusCode != http.StatusForbidden {
		t.Fatalf("status = %d, want 403", response.StatusCode)
	}
}

func TestHandlerGetAccessContextsHidesUnexpectedErrors(t *testing.T) {
	response := getAccessContexts(t, &accessContextsServiceFake{err: errors.New("database details")}, true)
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		t.Fatal(err)
	}
	if response.StatusCode != http.StatusInternalServerError || strings.Contains(string(body), "database details") {
		t.Fatalf("response = %d %s", response.StatusCode, body)
	}
}

func getAccessContexts(t *testing.T, service *accessContextsServiceFake, authenticated bool) *http.Response {
	t.Helper()
	app := fiber.New()
	if authenticated {
		app.Use(func(c *fiber.Ctx) error {
			c.SetUserContext(actor.WithID(c.UserContext(), "opaque-auth-id"))
			return c.Next()
		})
	}
	app.Get("/api/v1/users/me/access-contexts", user.NewHandler(nil, service).GetAccessContexts)
	response, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/v1/users/me/access-contexts", nil))
	if err != nil {
		t.Fatal(err)
	}
	return response
}

type accessContextsServiceFake struct {
	called     bool
	authUserID string
	result     []accesscontext.Context
	err        error
}

func (s *accessContextsServiceFake) ListByAuthUserID(_ context.Context, authUserID string) ([]accesscontext.Context, error) {
	s.called, s.authUserID = true, authUserID
	return s.result, s.err
}
