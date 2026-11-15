package church

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entchurch "github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (r *ChurchRepository) Update(ctx context.Context, id uuid.UUID, input churchdomain.UpdateInput) error {
	update := transaction.Client(ctx, r.client).Church.UpdateOneID(id).
		Where(entchurch.DeletedAtIsNil()).
		SetName(input.Name)
	if input.Timezone == nil {
		update.ClearTimezone()
	} else {
		update.SetTimezone(*input.Timezone)
	}
	if input.Website == nil {
		update.ClearWebsite()
	} else {
		update.SetWebsite(*input.Website)
	}
	if input.Bio == nil {
		update.ClearBio()
	} else {
		update.SetBio(*input.Bio)
	}
	if input.City == nil {
		update.ClearCity()
	} else {
		update.SetCity(*input.City)
	}
	if input.StateOrProvince == nil {
		update.ClearStateOrProvince()
	} else {
		update.SetStateOrProvince(*input.StateOrProvince)
	}
	if input.CountryCode == nil {
		update.ClearCountryCode()
	} else {
		update.SetCountryCode(*input.CountryCode)
	}
	_, err := update.Save(ctx)
	if entclient.IsNotFound(err) {
		return churchdomain.ErrChurchNotFound
	}
	if err != nil {
		return fmt.Errorf("update church: %w", err)
	}
	return nil
}
