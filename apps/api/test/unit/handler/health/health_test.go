package health_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/handler/health"
	"github.com/hislifecitychurch/churchbase/apps/api/pkg/response"
)

func TestLiveReturnsSuccessEnvelope(t *testing.T) {
	app := fiber.New()
	app.Get("/health/live", health.New().Live)
	request := httptest.NewRequest(http.MethodGet, "/health/live", nil)
	request.Header.Set(fiber.HeaderXRequestID, "request-1")

	result, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer result.Body.Close()
	var body response.Envelope[struct {
		Status string `json:"status"`
	}]
	if err := json.NewDecoder(result.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if result.StatusCode != http.StatusOK || !body.Success || body.Data.Status != "UP" {
		t.Fatalf("response = %d %+v", result.StatusCode, body)
	}
	if body.Metadata.RequestID == nil || *body.Metadata.RequestID != "request-1" {
		t.Fatalf("request ID = %v", body.Metadata.RequestID)
	}
}

func TestReadyReturnsFailureEnvelopeWhenDependencyIsDown(t *testing.T) {
	app := fiber.New()
	app.Get("/health/ready", health.New(failingChecker{}).Ready)

	result, err := app.Test(httptest.NewRequest(http.MethodGet, "/health/ready", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer result.Body.Close()
	var body response.Envelope[any]
	if err := json.NewDecoder(result.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if result.StatusCode != http.StatusServiceUnavailable || body.Success || len(body.Errors) != 1 || body.Errors[0].Code != "not_ready" {
		t.Fatalf("response = %d %+v", result.StatusCode, body)
	}
}

type failingChecker struct{}

func (failingChecker) Ping(context.Context) error { return errors.New("database unavailable") }
