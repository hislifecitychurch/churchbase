package application

import (
	"context"
	"errors"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

type UserByAuthUserID interface {
	GetByAuthUserID(context.Context, string) (userdomain.User, error)
}

type ProfileByUserID interface {
	GetByUserID(context.Context, uuid.UUID) (userprofile.Profile, error)
}

type CurrentUser struct {
	User                userdomain.User
	Profile             userprofile.Profile
	LastWorkspaceAccess *workspaceaccessevent.Event
}

type LatestWorkspaceAccessReader interface {
	GetLatestByUserID(context.Context, uuid.UUID) (workspaceaccessevent.Event, error)
}

type CurrentUserReader struct {
	users           UserByAuthUserID
	profiles        ProfileByUserID
	workspaceAccess LatestWorkspaceAccessReader
}

func NewCurrentUserReader(users UserByAuthUserID, profiles ProfileByUserID, workspaceAccess LatestWorkspaceAccessReader) *CurrentUserReader {
	return &CurrentUserReader{users: users, profiles: profiles, workspaceAccess: workspaceAccess}
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
	current := CurrentUser{User: user, Profile: profile}
	lastAccess, err := r.workspaceAccess.GetLatestByUserID(ctx, user.ID)
	if errors.Is(err, workspaceaccessevent.ErrEventNotFound) {
		return current, nil
	}
	if err != nil {
		return CurrentUser{}, err
	}
	current.LastWorkspaceAccess = &lastAccess
	return current, nil
}
