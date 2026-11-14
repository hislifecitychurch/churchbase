package church_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	churchhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestCreateRejectsMissingFieldsBeforeCallingService(t *testing.T) {
	service := &churchCreationServiceFake{}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	for _, body := range []string{"{", `{"name":" ","slug":"sample"}`, `{"name":"Sample Church"}`} {
		request := httptest.NewRequest(http.MethodPost, "/churches", strings.NewReader(body))
		request.Header.Set("Content-Type", "application/json")
		created, err := app.Test(request)
		if err != nil {
			t.Fatal(err)
		}
		created.Body.Close()
		if created.StatusCode != http.StatusBadRequest || service.called {
			t.Fatalf("invalid request status = %d, service called = %t", created.StatusCode, service.called)
		}
	}
}

func TestCreateReturnsCreatedChurch(t *testing.T) {
	id := uuid.New()
	timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
	service := &churchCreationServiceFake{created: churchdomain.Church{
		ID: id, Name: "Sample Church", Slug: "sample-church",
		Timezone: &timezone, Website: &website, Bio: &bio,
	}}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	request := httptest.NewRequest(http.MethodPost, "/churches", strings.NewReader(`{"name":"Sample Church","slug":"sample-church","timezone":"America/Chicago","website":"https://example.org","bio":"A welcoming church."}`))
	request.Header.Set("Content-Type", "application/json")
	created, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer created.Body.Close()
	var payload response.Envelope[struct {
		ID                string  `json:"id"`
		Name              string  `json:"name"`
		Slug              string  `json:"slug"`
		Timezone          *string `json:"timezone"`
		Website           *string `json:"website"`
		Bio               *string `json:"bio"`
		ActiveMemberCount int     `json:"active_member_count"`
	}]
	if err := json.NewDecoder(created.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if created.StatusCode != http.StatusCreated || !payload.Success || payload.Data.ID != id.String() || payload.Data.Name != "Sample Church" || payload.Data.Slug != "sample-church" || payload.Data.Timezone == nil || *payload.Data.Timezone != timezone || payload.Data.Website == nil || *payload.Data.Website != website || payload.Data.Bio == nil || *payload.Data.Bio != bio || payload.Data.ActiveMemberCount != 0 || service.authUserID != "auth-admin" {
		t.Fatalf("response = %d %+v, Auth user ID = %q", created.StatusCode, payload, service.authUserID)
	}
	if service.input.Timezone == nil || *service.input.Timezone != timezone || service.input.Website == nil || *service.input.Website != website || service.input.Bio == nil || *service.input.Bio != bio {
		t.Fatalf("service input = %+v", service.input)
	}
}

func TestCreateMapsAuthorizationAndSlugConflict(t *testing.T) {
	for _, test := range []struct {
		name string
		err  error
		code string
		want int
	}{
		{name: "unprovisioned", err: userdomain.ErrUserNotFound, code: "user_not_provisioned", want: http.StatusForbidden},
		{name: "forbidden", err: application.ErrChurchCreationForbidden, code: "forbidden", want: http.StatusForbidden},
		{name: "duplicate slug", err: churchdomain.ErrChurchSlugConflict, code: "church_slug_conflict", want: http.StatusConflict},
		{name: "internal failure", err: errors.New("database details stay private"), code: "internal_error", want: http.StatusInternalServerError},
	} {
		t.Run(test.name, func(t *testing.T) {
			service := &churchCreationServiceFake{err: test.err}
			app := appWithActor(churchhandler.NewHandler(service, service, service))
			request := httptest.NewRequest(http.MethodPost, "/churches", strings.NewReader(`{"name":"Sample","slug":"sample"}`))
			request.Header.Set("Content-Type", "application/json")
			created, err := app.Test(request)
			if err != nil {
				t.Fatal(err)
			}
			defer created.Body.Close()
			var payload response.Envelope[any]
			if err := json.NewDecoder(created.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			if created.StatusCode != test.want || len(payload.Errors) != 1 || payload.Errors[0].Code != test.code {
				t.Fatalf("response = %d %+v, want status %d and code %q", created.StatusCode, payload, test.want, test.code)
			}
		})
	}
}

func appWithActor(handler *churchhandler.Handler) *fiber.App {
	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.SetUserContext(actor.WithID(c.UserContext(), "auth-admin"))
		return c.Next()
	})
	app.Get("/churches", handler.GetAll)
	app.Post("/churches", handler.Create)
	app.Put("/churches/:churchID", handler.Update)
	return app
}

type churchCreationServiceFake struct {
	called        bool
	getAllCalled  bool
	updateCalled  bool
	authUserID    string
	updatedChurch uuid.UUID
	created       churchdomain.Church
	input         churchdomain.CreateInput
	updateInput   churchdomain.UpdateInput
	churches      []churchdomain.Church
	err           error
	getAllErr     error
	updateErr     error
}

func (s *churchCreationServiceFake) CreateByAuthUserID(_ context.Context, authUserID string, input churchdomain.CreateInput) (churchdomain.Church, error) {
	s.called, s.authUserID, s.input = true, authUserID, input
	return s.created, s.err
}

func (s *churchCreationServiceFake) GetAllByAuthUserID(_ context.Context, authUserID string) ([]churchdomain.Church, error) {
	s.getAllCalled, s.authUserID = true, authUserID
	return s.churches, s.getAllErr
}

func (s *churchCreationServiceFake) UpdateByAuthUserID(_ context.Context, authUserID string, churchID uuid.UUID, input churchdomain.UpdateInput) error {
	s.updateCalled, s.authUserID, s.updatedChurch, s.updateInput = true, authUserID, churchID, input
	return s.updateErr
}
