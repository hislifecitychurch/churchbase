package http_test

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	deliveryhttp "github.com/hislifecitychurch/churchbase/apps/api/internal/delivery/http"
)

func TestAccessLogIncludesAuthValidationFailure(t *testing.T) {
	reader, writer, err := os.Pipe()
	if err != nil {
		t.Fatal(err)
	}
	defer reader.Close()
	defer writer.Close()

	previousStdout := os.Stdout
	os.Stdout = writer
	app := deliveryhttp.New("http://localhost:36000", unavailableSessionValidator{}, nil, nil, nil)
	os.Stdout = previousStdout

	request := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	request.Header.Set(fiber.HeaderCookie, "session=credential-must-not-be-logged")
	request.Header.Set(fiber.HeaderXRequestID, "request-1")
	response, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	response.Body.Close()
	if response.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want %d", response.StatusCode, http.StatusServiceUnavailable)
	}

	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	logged, err := io.ReadAll(reader)
	if err != nil {
		t.Fatal(err)
	}
	line := strings.TrimSpace(string(logged))
	if strings.Contains(line, "\n") {
		t.Fatalf("expected one access-log line, got %q", line)
	}
	if !strings.HasSuffix(line, `auth_session_validation_failed request_id="request-1" error=upstream timeout`) {
		t.Fatalf("access log = %q", line)
	}
	if strings.Contains(line, "credential-must-not-be-logged") {
		t.Fatalf("access log contains the session cookie: %q", line)
	}
}

type unavailableSessionValidator struct{}

func (unavailableSessionValidator) Validate(context.Context, string, string) (string, bool, error) {
	return "", false, errors.New("upstream timeout")
}
