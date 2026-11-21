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

func TestGetByIDReturnsChurchDetails(t *testing.T) {
	id := uuid.New()
	timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
	city, state, countryCode := "Springfield", "Illinois", "US"
	service := &churchCreationServiceFake{church: churchdomain.Church{
		ID: id, Name: "Example Church", Slug: "example-church",
		Timezone: &timezone, Website: &website, Bio: &bio,
		City: &city, StateOrProvince: &state, CountryCode: &countryCode,
		ActiveMemberCount: 12, MinistryCount: 4,
	}}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	gotChurch, err := app.Test(httptest.NewRequest(http.MethodGet, "/churches/"+id.String(), nil))
	if err != nil {
		t.Fatal(err)
	}
	defer gotChurch.Body.Close()

	var payload response.Envelope[struct {
		ID                string  `json:"id"`
		Name              string  `json:"name"`
		Slug              string  `json:"slug"`
		Timezone          *string `json:"timezone"`
		Website           *string `json:"website"`
		Bio               *string `json:"bio"`
		City              *string `json:"city"`
		StateOrProvince   *string `json:"state_or_province"`
		CountryCode       *string `json:"country_code"`
		ProfileComplete   bool    `json:"profile_complete"`
		ActiveMemberCount int     `json:"active_member_count"`
		MinistryCount     int     `json:"ministry_count"`
	}]
	if err := json.NewDecoder(gotChurch.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if gotChurch.StatusCode != http.StatusOK || !payload.Success || payload.Data.ID != id.String() || payload.Data.Name != "Example Church" || payload.Data.Slug != "example-church" || payload.Data.Timezone == nil || *payload.Data.Timezone != timezone || payload.Data.Website == nil || *payload.Data.Website != website || payload.Data.Bio == nil || *payload.Data.Bio != bio || payload.Data.City == nil || *payload.Data.City != city || payload.Data.StateOrProvince == nil || *payload.Data.StateOrProvince != state || payload.Data.CountryCode == nil || *payload.Data.CountryCode != countryCode || !payload.Data.ProfileComplete || payload.Data.ActiveMemberCount != 12 || payload.Data.MinistryCount != 4 || !service.getByIDCalled || service.authUserID != "auth-admin" || service.churchID != id {
		t.Fatalf("response = %d %+v, GetByID called = %t, Auth user ID = %q, church ID = %s", gotChurch.StatusCode, payload, service.getByIDCalled, service.authUserID, service.churchID)
	}
}

func TestGetByIDRejectsInvalidIDBeforeCallingService(t *testing.T) {
	service := &churchCreationServiceFake{}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	gotChurch, err := app.Test(httptest.NewRequest(http.MethodGet, "/churches/not-a-uuid", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer gotChurch.Body.Close()

	var payload response.Envelope[any]
	if err := json.NewDecoder(gotChurch.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if gotChurch.StatusCode != http.StatusBadRequest || len(payload.Errors) != 1 || payload.Errors[0].Code != "invalid_church_id" || service.getByIDCalled {
		t.Fatalf("response = %d %+v, GetByID called = %t", gotChurch.StatusCode, payload, service.getByIDCalled)
	}
}

func TestGetByIDMapsAuthorizationAndLookupFailures(t *testing.T) {
	for _, test := range []struct {
		name string
		err  error
		code string
		want int
	}{
		{name: "unprovisioned", err: userdomain.ErrUserNotFound, code: "user_not_provisioned", want: http.StatusForbidden},
		{name: "forbidden", err: application.ErrChurchDirectoryForbidden, code: "forbidden", want: http.StatusForbidden},
		{name: "not found", err: churchdomain.ErrChurchNotFound, code: "church_not_found", want: http.StatusNotFound},
		{name: "internal failure", err: errors.New("database details stay private"), code: "internal_error", want: http.StatusInternalServerError},
	} {
		t.Run(test.name, func(t *testing.T) {
			service := &churchCreationServiceFake{getByIDErr: test.err}
			app := appWithActor(churchhandler.NewHandler(service, service, service))
			gotChurch, err := app.Test(httptest.NewRequest(http.MethodGet, "/churches/"+uuid.NewString(), nil))
			if err != nil {
				t.Fatal(err)
			}
			defer gotChurch.Body.Close()

			var payload response.Envelope[any]
			if err := json.NewDecoder(gotChurch.Body).Decode(&payload); err != nil {
				t.Fatal(err)
			}
			if gotChurch.StatusCode != test.want || len(payload.Errors) != 1 || payload.Errors[0].Code != test.code {
				t.Fatalf("response = %d %+v, want status %d and code %q", gotChurch.StatusCode, payload, test.want, test.code)
			}
		})
	}
}
