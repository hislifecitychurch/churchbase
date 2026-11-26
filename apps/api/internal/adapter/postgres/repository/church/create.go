package church

import (
	"context"
	"fmt"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (r *ChurchRepository) Create(ctx context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	record, err := transaction.Client(ctx, r.client).Church.Create().
		SetName(input.Name).
		SetSlug(input.Slug).
		SetNillableTimezone(input.Timezone).
		SetNillableWebsite(input.Website).
		SetNillableBio(input.Bio).
		SetNillableCity(input.City).
		SetNillableStateOrProvince(input.StateOrProvince).
		SetNillableCountryCode(input.CountryCode).
		Save(ctx)
	if entclient.IsConstraintError(err) {
		return churchdomain.Church{}, churchdomain.ErrChurchSlugConflict
	}
	if err != nil {
		return churchdomain.Church{}, fmt.Errorf("create church: %w", err)
	}
	return churchdomain.Church{
		ID: record.ID, Name: record.Name, Slug: record.Slug,
		Timezone: record.Timezone, Website: record.Website, Bio: record.Bio,
		City: record.City, StateOrProvince: record.StateOrProvince, CountryCode: record.CountryCode,
	}, nil
}
