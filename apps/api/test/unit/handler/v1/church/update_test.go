package church_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	churchhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestUpdateChurchReturnsUpdatedID(t *testing.T) {
	churchID := uuid.New()
	service := &churchCreationServiceFake{}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	request := httptest.NewRequest(http.MethodPut, "/churches/"+churchID.String(), strings.NewReader(`{"name":"Updated Church","timezone":"America/Chicago","website":"https://example.org","bio":"A welcoming church.","city":"Springfield","state_or_province":"Illinois","country_code":"US"}`))
	request.Header.Set("Content-Type", "application/json")
	updated, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer updated.Body.Close()

	var payload response.Envelope[struct {
		ID string `json:"id"`
	}]
	if err := json.NewDecoder(updated.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if updated.StatusCode != http.StatusOK || !payload.Success || payload.Data.ID != churchID.String() || !service.updateCalled || service.authUserID != "auth-admin" || service.updatedChurch != churchID {
		t.Fatalf("response = %d %+v, update called = %t, auth user = %q, church = %s", updated.StatusCode, payload, service.updateCalled, service.authUserID, service.updatedChurch)
	}
	if service.updateInput.Name != "Updated Church" || service.updateInput.Timezone == nil || *service.updateInput.Timezone != "America/Chicago" || service.updateInput.Website == nil || *service.updateInput.Website != "https://example.org" || service.updateInput.Bio == nil || *service.updateInput.Bio != "A welcoming church." || service.updateInput.City == nil || *service.updateInput.City != "Springfield" || service.updateInput.StateOrProvince == nil || *service.updateInput.StateOrProvince != "Illinois" || service.updateInput.CountryCode == nil || *service.updateInput.CountryCode != "US" {
		t.Fatalf("update input = %+v", service.updateInput)
	}
}

func TestUpdateChurchRejectsInvalidIDAndName(t *testing.T) {
	for _, test := range []struct {
		path string
		body string
	}{
		{path: "/churches/not-a-uuid", body: `{"name":"Church"}`},
		{path: "/churches/" + uuid.NewString(), body: `{"name":" "}`},
	} {
		service := &churchCreationServiceFake{}
		app := appWithActor(churchhandler.NewHandler(service, service, service))
		request := httptest.NewRequest(http.MethodPut, test.path, strings.NewReader(test.body))
		request.Header.Set("Content-Type", "application/json")
		updated, err := app.Test(request)
		if err != nil {
			t.Fatal(err)
		}
		updated.Body.Close()
		if updated.StatusCode != http.StatusBadRequest || service.updateCalled {
			t.Fatalf("status = %d, update called = %t, want 400 and no update", updated.StatusCode, service.updateCalled)
		}
	}
}

func TestUpdateChurchMapsAuthorizationAndPersistenceFailures(t *testing.T) {
	for _, test := range []struct {
		name string
		err  error
		code string
		want int
	}{
		{name: "unprovisioned", err: userdomain.ErrUserNotFound, code: "user_not_provisioned", want: http.StatusForbidden},
		{name: "forbidden", err: application.ErrChurchUpdateForbidden, code: "forbidden", want: http.StatusForbidden},
		{name: "invalid", err: churchdomain.ErrInvalidChurch, code: "invalid_church", want: http.StatusBadRequest},
		{name: "not found", err: churchdomain.ErrChurchNotFound, code: "church_not_found", want: http.StatusNotFound},
		{name: "internal failure", err: errors.New("database details stay private"), code: "internal_error", want: http.StatusInternalServerError},
	} {
		t.Run(test.name, func(t *testing.T) {
			service := &churchCreationServiceFake{updateErr: test.err}
			app := appWithActor(churchhandler.NewHandler(service, service, service))
			request := httptest.NewRequest(http.MethodPut, "/churches/"+uuid.NewString(), strings.NewReader(`{"name":"Church"}`))
			request.Header.Set("Content-Type", "application/json")
			updated, err := app.Test(request)
			if err != nil {
				t.Fatal(err)
			}
			defer updated.Body.Close()
			var payload response.Envelope[any]
			if err := json.NewDecoder(updated.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			if updated.StatusCode != test.want || len(payload.Errors) != 1 || payload.Errors[0].Code != test.code {
				t.Fatalf("response = %d %+v, want status %d and code %q", updated.StatusCode, payload, test.want, test.code)
			}
		})
	}
}
