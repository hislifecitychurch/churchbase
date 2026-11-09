package application

import (
	"context"
	"errors"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

var ErrWorkspaceAccessForbidden = errors.New("workspace access is forbidden")

type WorkspaceAccessEventService interface {
	Record(context.Context, workspaceaccessevent.RecordInput) (workspaceaccessevent.Event, bool, error)
	List(context.Context, workspaceaccessevent.ListFilter) (workspaceaccessevent.Page, error)
}

type UserProfilesByIDs interface {
	GetByUserIDs(context.Context, []uuid.UUID) ([]userprofile.Profile, error)
}

type WorkspaceAccessRecord struct {
	Event   workspaceaccessevent.Event
	Profile *userprofile.Profile
}

type WorkspaceAccessHistory struct {
	Events []WorkspaceAccessRecord
	Total  int
}

type WorkspaceAccessService struct {
	users    UserByAuthUserID
	events   WorkspaceAccessEventService
	profiles UserProfilesByIDs
}

func NewWorkspaceAccessService(
	users UserByAuthUserID,
	events WorkspaceAccessEventService,
	profiles UserProfilesByIDs,
) *WorkspaceAccessService {
	return &WorkspaceAccessService{users: users, events: events, profiles: profiles}
}

func (s *WorkspaceAccessService) RecordByAuthUserID(
	ctx context.Context,
	authUserID string,
	input workspaceaccessevent.RecordInput,
) (workspaceaccessevent.Event, bool, error) {
	user, err := s.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return workspaceaccessevent.Event{}, false, err
	}
	if input.Workspace == workspaceaccessevent.WorkspacePlatform && !hasGlobalRole(user) {
		return workspaceaccessevent.Event{}, false, ErrWorkspaceAccessForbidden
	}
	input.UserID = user.ID
	return s.events.Record(ctx, input)
}

func (s *WorkspaceAccessService) ListForAdmin(
	ctx context.Context,
	authUserID string,
	filter workspaceaccessevent.ListFilter,
) (WorkspaceAccessHistory, error) {
	user, err := s.users.GetByAuthUserID(ctx, authUserID)
	if err != nil {
		return WorkspaceAccessHistory{}, err
	}
	if user.GlobalRoles == nil || *user.GlobalRoles != userdomain.GlobalRoleAdmin {
		return WorkspaceAccessHistory{}, ErrWorkspaceAccessForbidden
	}

	page, err := s.events.List(ctx, filter)
	if err != nil {
		return WorkspaceAccessHistory{}, err
	}
	userIDs := make([]uuid.UUID, 0, len(page.Events))
	for _, event := range page.Events {
		userIDs = append(userIDs, event.UserID)
	}
	profiles, err := s.profiles.GetByUserIDs(ctx, userIDs)
	if err != nil {
		return WorkspaceAccessHistory{}, err
	}
	profilesByUserID := make(map[uuid.UUID]*userprofile.Profile, len(profiles))
	for index := range profiles {
		profile := profiles[index]
		profilesByUserID[profile.UserID] = &profile
	}

	records := make([]WorkspaceAccessRecord, 0, len(page.Events))
	for _, event := range page.Events {
		records = append(records, WorkspaceAccessRecord{Event: event, Profile: profilesByUserID[event.UserID]})
	}
	return WorkspaceAccessHistory{Events: records, Total: page.Total}, nil
}

func hasGlobalRole(user userdomain.User) bool {
	return user.GlobalRoles != nil &&
		(*user.GlobalRoles == userdomain.GlobalRoleAdmin || *user.GlobalRoles == userdomain.GlobalRoleStaff)
}
