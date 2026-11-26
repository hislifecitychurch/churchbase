package userprofile

import (
	"context"
	"fmt"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	userprofiledomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func (r *UserProfileRepository) Create(ctx context.Context, input userprofiledomain.CreateInput) (userprofiledomain.Profile, error) {
	created, err := transaction.Client(ctx, r.client).UserProfile.Create().
		SetUserID(input.UserID).
		SetNillableFirstName(input.FirstName).
		SetNillableLastName(input.LastName).
		Save(ctx)
	if err != nil {
		return userprofiledomain.Profile{}, fmt.Errorf("create API user profile: %w", err)
	}
	return userprofiledomain.Profile{
		ID:        created.ID,
		UserID:    created.UserID,
		FirstName: created.FirstName,
		LastName:  created.LastName,
	}, nil
}
