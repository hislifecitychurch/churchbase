package service

import (
	"context"
	"fmt"
	"net/url"
	"strings"
	"time"
	_ "time/tzdata"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (s *Service) Create(ctx context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	input.Name = strings.TrimSpace(input.Name)
	input.Slug = strings.TrimSpace(input.Slug)
	input.Timezone = cleanOptional(input.Timezone)
	input.Website = cleanOptional(input.Website)
	input.Bio = cleanOptional(input.Bio)
	input.City = cleanOptional(input.City)
	input.StateOrProvince = cleanOptional(input.StateOrProvince)
	input.CountryCode = cleanCountryCode(input.CountryCode)
	if input.Name == "" || input.Slug == "" || !validChurchDetails(input.Timezone, input.Website) || !validCountryCode(input.CountryCode) {
		return churchdomain.Church{}, fmt.Errorf("%w: invalid required or optional church details", churchdomain.ErrInvalidChurch)
	}
	return s.repository.Create(ctx, input)
}

func cleanOptional(value *string) *string {
	if value == nil {
		return nil
	}
	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

func cleanCountryCode(value *string) *string {
	countryCode := cleanOptional(value)
	if countryCode == nil || len(*countryCode) != 2 || !isASCIILetter((*countryCode)[0]) || !isASCIILetter((*countryCode)[1]) {
		return countryCode
	}
	upper := strings.ToUpper(*countryCode)
	return &upper
}

func isASCIILetter(value byte) bool {
	return value >= 'A' && value <= 'Z' || value >= 'a' && value <= 'z'
}

func validCountryCode(value *string) bool {
	if value == nil {
		return true
	}
	return len(*value) == 2 && (*value)[0] >= 'A' && (*value)[0] <= 'Z' && (*value)[1] >= 'A' && (*value)[1] <= 'Z'
}

func validChurchDetails(timezone, websiteValue *string) bool {
	if timezone != nil {
		if *timezone == "Local" {
			return false
		}
		if _, err := time.LoadLocation(*timezone); err != nil {
			return false
		}
	}
	if websiteValue != nil {
		website, err := url.Parse(*websiteValue)
		if err != nil || (website.Scheme != "http" && website.Scheme != "https") || website.Hostname() == "" || website.User != nil {
			return false
		}
	}
	return true
}
