package userprofile

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	entprofile "github.com/hislifecitychurch/churchbase/apps/api/ent/userprofile"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userprofiledomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (r *UserProfileRepository) GetByUserIDs(ctx context.Context, userIDs []uuid.UUID) ([]userprofiledomain.Profile, error) {
	records, err := transaction.Client(ctx, r.client).UserProfile.Query().
		Where(entprofile.UserIDIn(userIDs...)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("get API user profiles: %w", err)
	}
	profiles := make([]userprofiledomain.Profile, 0, len(records))
	for _, record := range records {
		profiles = append(profiles, userprofiledomain.Profile{
			ID:        record.ID,
			UserID:    record.UserID,
			FirstName: record.FirstName,
			LastName:  record.LastName,
		})
	}
	return profiles, nil
}
