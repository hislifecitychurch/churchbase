package userprofile

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entprofile "github.com/hislifecitychurch/churchbase/apps/api/ent/userprofile"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userprofiledomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (r *UserProfileRepository) GetByUserID(ctx context.Context, userID uuid.UUID) (userprofiledomain.Profile, error) {
	record, err := transaction.Client(ctx, r.client).UserProfile.Query().Where(entprofile.UserID(userID)).Only(ctx)
	if entclient.IsNotFound(err) {
		return userprofiledomain.Profile{}, userprofiledomain.ErrProfileNotFound
	}
	if err != nil {
		return userprofiledomain.Profile{}, fmt.Errorf("get API user profile: %w", err)
	}
	return userprofiledomain.Profile{
		ID:        record.ID,
		UserID:    record.UserID,
		FirstName: record.FirstName,
		LastName:  record.LastName,
	}, nil
}
