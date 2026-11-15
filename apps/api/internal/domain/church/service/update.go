package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (s *Service) Update(ctx context.Context, id uuid.UUID, input churchdomain.UpdateInput) error {
	input.Name = strings.TrimSpace(input.Name)
	input.Timezone = cleanOptional(input.Timezone)
	input.Website = cleanOptional(input.Website)
	input.Bio = cleanOptional(input.Bio)
	input.City = cleanOptional(input.City)
	input.StateOrProvince = cleanOptional(input.StateOrProvince)
	input.CountryCode = cleanCountryCode(input.CountryCode)
	if input.Name == "" || !validChurchDetails(input.Timezone, input.Website) || !validCountryCode(input.CountryCode) {
		return fmt.Errorf("%w: invalid church details", churchdomain.ErrInvalidChurch)
	}
	return s.repository.Update(ctx, id, input)
}
