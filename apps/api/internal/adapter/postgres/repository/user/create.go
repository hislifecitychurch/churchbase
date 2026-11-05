package user

import (
	"context"
	"fmt"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func (r *UserRepository) Create(ctx context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	created, err := r.client.User.Create().
		SetNillableAuthUserID(input.AuthUserID).
		SetNillableFirstName(input.FirstName).
		SetNillableLastName(input.LastName).
		Save(ctx)
	if err != nil {
		return userdomain.User{}, fmt.Errorf("create API user: %w", err)
	}

	return userdomain.User{
		ID:         created.ID,
		AuthUserID: created.AuthUserID,
		FirstName:  created.FirstName,
		LastName:   created.LastName,
	}, nil
}
