package me_test

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
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/me"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
)

func TestHandlerGetReturnsCurrentAPIUser(t *testing.T) {
	userID := uuid.New()
	firstName, lastName := "Ada", "Lovelace"
	role := userdomain.PlatformRoleAdmin
	service := &currentUserServiceFake{result: application.CurrentUser{
		User:    userdomain.User{ID: userID, PlatformRole: &role},
		Profile: userprofile.Profile{UserID: userID, FirstName: &firstName, LastName: &lastName},
	}}
	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.SetUserContext(actor.WithID(c.UserContext(), "auth-user-private"))
		return c.Next()
	})
	app.Get("/api/v1/me", me.NewHandler(service).Get)

	response, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/v1/me", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		t.Fatal(err)
	}
	var payload struct {
		ID           string `json:"id"`
		PlatformRole string `json:"platform_role"`
		Profile      struct {
			FirstName string `json:"first_name"`
			LastName  string `json:"last_name"`
		} `json:"profile"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		t.Fatal(err)
	}
	if response.StatusCode != http.StatusOK || payload.ID != userID.String() || payload.PlatformRole != "admin" || payload.Profile.FirstName != firstName || payload.Profile.LastName != lastName {
		t.Fatalf("response = %d %s", response.StatusCode, body)
	}
	if service.authUserID != "auth-user-private" || strings.Contains(string(body), "auth-user-private") {
		t.Fatalf("Auth user ID lookup/output = %q / %s", service.authUserID, body)
	}
}

func TestHandlerGetRejectsMissingActor(t *testing.T) {
	service := &currentUserServiceFake{}
	app := fiber.New()
	app.Get("/api/v1/me", me.NewHandler(service).Get)

	response, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/v1/me", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusUnauthorized || service.called {
		t.Fatalf("status = %d, service called = %v", response.StatusCode, service.called)
	}
}

func TestHandlerGetMapsMissingAPIUserToForbidden(t *testing.T) {
	service := &currentUserServiceFake{err: userdomain.ErrUserNotFound}
	response := getCurrentUser(t, service)
	defer response.Body.Close()
	if response.StatusCode != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", response.StatusCode, http.StatusForbidden)
	}
}

func TestHandlerGetHidesUnexpectedErrors(t *testing.T) {
	service := &currentUserServiceFake{err: errors.New("database details")}
	response := getCurrentUser(t, service)
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		t.Fatal(err)
	}
	if response.StatusCode != http.StatusInternalServerError || strings.Contains(string(body), "database details") {
		t.Fatalf("response = %d %s", response.StatusCode, body)
	}
}

func getCurrentUser(t *testing.T, service *currentUserServiceFake) *http.Response {
	t.Helper()
	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.SetUserContext(actor.WithID(c.UserContext(), "auth-user-1"))
		return c.Next()
	})
	app.Get("/api/v1/me", me.NewHandler(service).Get)
	response, err := app.Test(httptest.NewRequest(http.MethodGet, "/api/v1/me", nil))
	if err != nil {
		t.Fatal(err)
	}
	return response
}

type currentUserServiceFake struct {
	called     bool
	authUserID string
	result     application.CurrentUser
	err        error
}

func (s *currentUserServiceFake) GetByAuthUserID(_ context.Context, authUserID string) (application.CurrentUser, error) {
	s.called, s.authUserID = true, authUserID
	return s.result, s.err
}
