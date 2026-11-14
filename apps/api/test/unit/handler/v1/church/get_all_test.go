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

func TestGetAllReturnsChurchesForAuthenticatedGlobalUser(t *testing.T) {
	id := uuid.New()
	timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
	service := &churchCreationServiceFake{churches: []churchdomain.Church{{
		ID: id, Name: "Sample Church", Slug: "sample-church",
		Timezone: &timezone, Website: &website, Bio: &bio, ActiveMemberCount: 12,
	}}}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	request := httptest.NewRequest(http.MethodGet, "/churches", nil)
	gotAll, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer gotAll.Body.Close()

	var payload response.Envelope[[]struct {
		ID                string  `json:"id"`
		Name              string  `json:"name"`
		Slug              string  `json:"slug"`
		Timezone          *string `json:"timezone"`
		Website           *string `json:"website"`
		Bio               *string `json:"bio"`
		ActiveMemberCount int     `json:"active_member_count"`
	}]
	if err := json.NewDecoder(gotAll.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if gotAll.StatusCode != http.StatusOK || !payload.Success || len(payload.Data) != 1 || payload.Data[0].ID != id.String() || payload.Data[0].Name != "Sample Church" || payload.Data[0].Slug != "sample-church" || payload.Data[0].Timezone == nil || *payload.Data[0].Timezone != timezone || payload.Data[0].Website == nil || *payload.Data[0].Website != website || payload.Data[0].Bio == nil || *payload.Data[0].Bio != bio || payload.Data[0].ActiveMemberCount != 12 || !service.getAllCalled || service.authUserID != "auth-admin" {
		t.Fatalf("response = %d %+v, GetAll called = %t, Auth user ID = %q", gotAll.StatusCode, payload, service.getAllCalled, service.authUserID)
	}
}

func TestGetAllMapsAuthorizationAndInternalFailures(t *testing.T) {
	for _, test := range []struct {
		name string
		err  error
		code string
		want int
	}{
		{name: "unprovisioned", err: userdomain.ErrUserNotFound, code: "user_not_provisioned", want: http.StatusForbidden},
		{name: "forbidden", err: application.ErrChurchDirectoryForbidden, code: "forbidden", want: http.StatusForbidden},
		{name: "internal failure", err: errors.New("database details stay private"), code: "internal_error", want: http.StatusInternalServerError},
	} {
		t.Run(test.name, func(t *testing.T) {
			service := &churchCreationServiceFake{getAllErr: test.err}
			app := appWithActor(churchhandler.NewHandler(service, service, service))
			gotAll, err := app.Test(httptest.NewRequest(http.MethodGet, "/churches", nil))
			if err != nil {
				t.Fatal(err)
			}
			defer gotAll.Body.Close()

			var payload response.Envelope[any]
			if err := json.NewDecoder(gotAll.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			if gotAll.StatusCode != test.want || len(payload.Errors) != 1 || payload.Errors[0].Code != test.code {
				t.Fatalf("response = %d %+v, want status %d and code %q", gotAll.StatusCode, payload, test.want, test.code)
			}
		})
	}
}
