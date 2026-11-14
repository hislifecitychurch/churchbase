package service

import (
	"context"
	"fmt"
	"strings"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (s *Service) Create(ctx context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	input.Name = strings.TrimSpace(input.Name)
	input.Slug = strings.TrimSpace(input.Slug)
	if input.Name == "" || input.Slug == "" {
		return churchdomain.Church{}, fmt.Errorf("%w: name and slug are required", churchdomain.ErrInvalidChurch)
	}
	return s.repository.Create(ctx, input)
}
