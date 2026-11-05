package auth_test

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
)

type sessionValidator struct {
	id            string
	valid         bool
	err           error
	calls         int
	cookie        string
	authorization string
}

func (v *sessionValidator) Validate(_ context.Context, cookie, authorization string) (string, bool, error) {
	v.calls++
	v.cookie, v.authorization = cookie, authorization
	return v.id, v.valid, v.err
}

func TestRequireRejectsMissingAndInvalidSessions(t *testing.T) {
	tests := []struct {
		name       string
		cookie     string
		validator  *sessionValidator
		wantStatus int
		wantCalls  int
	}{
		{name: "missing credentials", validator: &sessionValidator{valid: true, id: "auth-user-1"}, wantStatus: http.StatusUnauthorized},
		{name: "invalid session", cookie: "session=invalid", validator: &sessionValidator{}, wantStatus: http.StatusUnauthorized, wantCalls: 1},
		{name: "unavailable auth service", cookie: "session=present", validator: &sessionValidator{err: errors.New("upstream timeout")}, wantStatus: http.StatusServiceUnavailable, wantCalls: 1},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			app := fiber.New()
			app.Get("/protected", authmiddleware.Require(test.validator), func(c *fiber.Ctx) error { return c.SendStatus(http.StatusNoContent) })
			request := httptest.NewRequest(http.MethodGet, "/protected", nil)
			if test.cookie != "" {
				request.Header.Set("Cookie", test.cookie)
			}

			response, err := app.Test(request)
			if err != nil {
				t.Fatal(err)
			}
			defer response.Body.Close()
			if response.StatusCode != test.wantStatus {
				t.Fatalf("status = %d, want %d", response.StatusCode, test.wantStatus)
			}
			if test.validator.calls != test.wantCalls {
				t.Fatalf("validator calls = %d, want %d", test.validator.calls, test.wantCalls)
			}
		})
	}
}

func TestRequireSetsAuthenticatedActor(t *testing.T) {
	validator := &sessionValidator{id: "auth-user-1", valid: true}
	app := fiber.New()
	app.Get("/protected", authmiddleware.Require(validator), func(c *fiber.Ctx) error {
		id, ok := actor.ID(c.UserContext())
		if !ok {
			return c.SendStatus(http.StatusInternalServerError)
		}
		return c.SendString(id)
	})
	request := httptest.NewRequest(http.MethodGet, "/protected", nil)
	request.Header.Set("Cookie", "session=present")
	request.Header.Set("Authorization", "Bearer token")

	response, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		t.Fatal(err)
	}
	if response.StatusCode != http.StatusOK || string(body) != "auth-user-1" {
		t.Fatalf("response = %d %q", response.StatusCode, body)
	}
	if validator.cookie != "session=present" || validator.authorization != "Bearer token" {
		t.Fatalf("credentials = %q / %q", validator.cookie, validator.authorization)
	}
}
