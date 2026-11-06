package application

import (
	"context"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

type UserByAuthUserID interface {
	GetByAuthUserID(context.Context, string) (userdomain.User, error)
}

type ProfileByUserID interface {
	GetByUserID(context.Context, uuid.UUID) (userprofile.Profile, error)
}

type CurrentUser struct {
	User    userdomain.User
	Profile userprofile.Profile
}

type CurrentUserReader struct {
	users    UserByAuthUserID
	profiles ProfileByUserID
}

func NewCurrentUserReader(users UserByAuthUserID, profiles ProfileByUserID) *CurrentUserReader {
	return &CurrentUserReader{users: users, profiles: profiles}
}

func (r *CurrentUserReader) GetByAuthUserID(ctx context.Context, authUserID string) (CurrentUser, error) {
	user, err := r.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return CurrentUser{}, err
	}
	profile, err := r.profiles.GetByUserID(ctx, user.ID)
	if err != nil {
		return CurrentUser{}, err
	}
	return CurrentUser{User: user, Profile: profile}, nil
}
