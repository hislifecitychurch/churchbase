package response_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestSuccessWritesEnvelopeWithRequestAndUserMetadata(t *testing.T) {
	app := fiber.New()
	app.Get("/", func(c *fiber.Ctx) error {
		body := response.Success(map[string]string{"id": "item-1"}, "Item retrieved", c, "item.retrieved", "user-1", "info")
		return response.JSON(c, fiber.StatusOK, body)
	})

	request := httptest.NewRequest(http.MethodGet, "/", nil)
	request.Header.Set(fiber.HeaderXRequestID, "request-1")
	result, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer result.Body.Close()

	var body response.Envelope[map[string]string]
	if err := json.NewDecoder(result.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if result.StatusCode != http.StatusOK || !body.Success || body.Message != "Item retrieved" || body.Data["id"] != "item-1" {
		t.Fatalf("body = %#v", body)
	}
	if body.Metadata.RequestID == nil || *body.Metadata.RequestID != "request-1" {
		t.Fatalf("request ID = %v", body.Metadata.RequestID)
	}
	if body.Log.UserID == nil || *body.Log.UserID != "user-1" || body.Log.Status != "info" {
		t.Fatalf("log = %#v", body.Log)
	}
	if body.Errors == nil || len(body.Errors) != 0 {
		t.Fatalf("success errors = %#v, want empty list", body.Errors)
	}
}

func TestFailureWritesErrorDetails(t *testing.T) {
	app := fiber.New()
	app.Get("/", func(c *fiber.Ctx) error {
		return response.JSON(c, fiber.StatusBadRequest, response.FailureWithError[any]("Invalid request", "invalid_request", "Email is required", c, "request.invalid", "", "warning"))
	})

	result, err := app.Test(httptest.NewRequest(http.MethodGet, "/", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer result.Body.Close()

	var body response.Envelope[any]
	if err := json.NewDecoder(result.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if result.StatusCode != http.StatusBadRequest || body.Success || body.Message != "Invalid request" || len(body.Errors) != 1 {
		t.Fatalf("body = %#v", body)
	}
	if body.Errors[0].Code != "invalid_request" || body.Errors[0].Message != "Email is required" {
		t.Fatalf("errors = %#v", body.Errors)
	}
}
