package church_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	churchhandler "github.com/hislifecitychurch/churchbase/apps/api/internal/handler/v1/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func TestListReturnsChurchesForAuthenticatedGlobalUser(t *testing.T) {
	id := uuid.New()
	service := &churchCreationServiceFake{churches: []churchdomain.Church{{ID: id, Name: "Sample Church", Slug: "sample-church"}}}
	app := appWithActor(churchhandler.NewHandler(service, service))
	request := httptest.NewRequest(http.MethodGet, "/churches", nil)
	listed, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer listed.Body.Close()

	var payload response.Envelope[[]struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		Slug string `json:"slug"`
	}]
	if err := json.NewDecoder(listed.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if listed.StatusCode != http.StatusOK || !payload.Success || len(payload.Data) != 1 || payload.Data[0].ID != id.String() || payload.Data[0].Name != "Sample Church" || payload.Data[0].Slug != "sample-church" || !service.listCalled || service.authUserID != "auth-admin" {
		t.Fatalf("response = %d %+v, list called = %t, Auth user ID = %q", listed.StatusCode, payload, service.listCalled, service.authUserID)
	}
}

func TestListMapsAuthorizationAndInternalFailures(t *testing.T) {
	for _, test := range []struct {
		name string
		err  error
		code string
		want int
	}{
		{name: "unprovisioned", err: userdomain.ErrUserNotFound, code: "user_not_provisioned", want: http.StatusForbidden},
		{name: "forbidden", err: application.ErrChurchListingForbidden, code: "forbidden", want: http.StatusForbidden},
		{name: "internal failure", err: errors.New("database details stay private"), code: "internal_error", want: http.StatusInternalServerError},
	} {
		t.Run(test.name, func(t *testing.T) {
			service := &churchCreationServiceFake{listErr: test.err}
			app := appWithActor(churchhandler.NewHandler(service, service))
			listed, err := app.Test(httptest.NewRequest(http.MethodGet, "/churches", nil))
			if err != nil {
				t.Fatal(err)
			}
			defer listed.Body.Close()

			var payload response.Envelope[any]
			if err := json.NewDecoder(listed.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			if listed.StatusCode != test.want || len(payload.Errors) != 1 || payload.Errors[0].Code != test.code {
				t.Fatalf("response = %d %+v, want status %d and code %q", listed.StatusCode, payload, test.want, test.code)
			}
		})
	}
}
