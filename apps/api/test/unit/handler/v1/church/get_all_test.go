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
	timezone, bio := "America/Chicago", "A welcoming church."
	city, state, countryCode := "Springfield", "Illinois", "US"
	service := &churchCreationServiceFake{churches: []churchdomain.ChurchSummary{{
		ID: id, Name: "Sample Church", Slug: "sample-church",
		Timezone: &timezone, Bio: &bio,
		City: &city, StateOrProvince: &state, CountryCode: &countryCode, ActiveMemberCount: 12,
	}}}
	app := appWithActor(churchhandler.NewHandler(service, service, service))
	request := httptest.NewRequest(http.MethodGet, "/churches", nil)
	gotAll, err := app.Test(request)
	if err != nil {
		t.Fatal(err)
	}
	defer gotAll.Body.Close()

	var payload response.Envelope[[]json.RawMessage]
	if err := json.NewDecoder(gotAll.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if gotAll.StatusCode != http.StatusOK || !payload.Success || len(payload.Data) != 1 || !service.getAllCalled || service.authUserID != "auth-admin" {
		t.Fatalf("response = %d %+v, GetAll called = %t, Auth user ID = %q", gotAll.StatusCode, payload, service.getAllCalled, service.authUserID)
	}
	var item struct {
		ID                string  `json:"id"`
		Name              string  `json:"name"`
		Slug              string  `json:"slug"`
		Timezone          *string `json:"timezone"`
		Bio               *string `json:"bio"`
		City              *string `json:"city"`
		StateOrProvince   *string `json:"state_or_province"`
		CountryCode       *string `json:"country_code"`
		ActiveMemberCount int     `json:"active_member_count"`
	}
	if err := json.Unmarshal(payload.Data[0], &item); err != nil {
		t.Fatal(err)
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(payload.Data[0], &fields); err != nil {
		t.Fatal(err)
	}
	if len(fields) != 9 || item.ID != id.String() || item.Name != "Sample Church" || item.Slug != "sample-church" || item.Timezone == nil || *item.Timezone != timezone || item.Bio == nil || *item.Bio != bio || item.City == nil || *item.City != city || item.StateOrProvince == nil || *item.StateOrProvince != state || item.CountryCode == nil || *item.CountryCode != countryCode || item.ActiveMemberCount != 12 {
		t.Fatalf("directory response = %+v, fields = %v", item, fields)
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
