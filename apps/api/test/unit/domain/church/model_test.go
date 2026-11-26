package church_test

import (
	"testing"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func TestIsProfileComplete(t *testing.T) {
	city, countryCode, timezone := "Springfield", "US", "America/Chicago"
	complete := churchdomain.Church{City: &city, CountryCode: &countryCode, Timezone: &timezone}

	for _, test := range []struct {
		name   string
		church churchdomain.Church
		want   bool
	}{
		{name: "required details without optional details", church: complete, want: true},
		{name: "missing city", church: churchdomain.Church{CountryCode: &countryCode, Timezone: &timezone}},
		{name: "missing country", church: churchdomain.Church{City: &city, Timezone: &timezone}},
		{name: "missing time zone", church: churchdomain.Church{City: &city, CountryCode: &countryCode}},
		{name: "blank required detail", church: churchdomain.Church{City: &city, CountryCode: &countryCode, Timezone: new(string)}},
	} {
		t.Run(test.name, func(t *testing.T) {
			if got := test.church.IsProfileComplete(); got != test.want {
				t.Fatalf("IsProfileComplete() = %t, want %t", got, test.want)
			}
		})
	}
}
