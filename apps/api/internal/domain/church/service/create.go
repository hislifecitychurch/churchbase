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
	if input.Name == "" || input.Slug == "" || !validChurchDetails(input) {
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

func validChurchDetails(input churchdomain.CreateInput) bool {
	if input.Timezone != nil {
		if *input.Timezone == "Local" {
			return false
		}
		if _, err := time.LoadLocation(*input.Timezone); err != nil {
			return false
		}
	}
	if input.Website != nil {
		website, err := url.Parse(*input.Website)
		if err != nil || (website.Scheme != "http" && website.Scheme != "https") || website.Hostname() == "" || website.User != nil {
			return false
		}
	}
	return true
}
