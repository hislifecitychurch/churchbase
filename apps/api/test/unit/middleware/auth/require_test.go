package auth_test

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	authmiddleware "github.com/hislifecitychurch/churchbase/apps/api/internal/middleware/auth"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	apiresponse "github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
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
		wantCode   string
	}{
		{name: "missing credentials", validator: &sessionValidator{valid: true, id: "auth-user-1"}, wantStatus: http.StatusUnauthorized, wantCode: "unauthorized"},
		{name: "invalid session", cookie: "session=invalid", validator: &sessionValidator{}, wantStatus: http.StatusUnauthorized, wantCalls: 1, wantCode: "unauthorized"},
		{name: "unavailable auth service", cookie: "session=present", validator: &sessionValidator{err: errors.New("upstream timeout")}, wantStatus: http.StatusServiceUnavailable, wantCalls: 1, wantCode: "auth_unavailable"},
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
			var body apiresponse.Envelope[any]
			if err := json.NewDecoder(response.Body).Decode(&body); err != nil {
				t.Fatal(err)
			}
			if body.Success || len(body.Errors) != 1 || body.Errors[0].Code != test.wantCode {
				t.Fatalf("error envelope = %+v, want code %q", body, test.wantCode)
			}
		})
	}
}

func TestRequireLogsAuthValidationFailuresWithRequestID(t *testing.T) {
	var output bytes.Buffer
	previousOutput := log.Writer()
	log.SetOutput(&output)
	t.Cleanup(func() { log.SetOutput(previousOutput) })

	app := fiber.New()
	app.Use(requestid.New())
	app.Get("/protected", authmiddleware.Require(&sessionValidator{err: errors.New("upstream timeout")}), func(c *fiber.Ctx) error {
		return c.SendStatus(http.StatusNoContent)
	})
	request := httptest.NewRequest(http.MethodGet, "/protected", nil)
	request.Header.Set(fiber.HeaderCookie, "session=credential-must-not-be-logged")
	request.Header.Set(fiber.HeaderXRequestID, "request-1")

	response, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want %d", response.StatusCode, http.StatusServiceUnavailable)
	}

	logged := output.String()
	for _, expected := range []string{"auth_session_validation_failed", `request_id="request-1"`, "error=upstream timeout"} {
		if !strings.Contains(logged, expected) {
			t.Errorf("log output %q does not contain %q", logged, expected)
		}
	}
	if strings.Contains(logged, "credential-must-not-be-logged") {
		t.Fatalf("log output contains the session cookie: %q", logged)
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
