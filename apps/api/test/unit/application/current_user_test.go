package application_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	workspaceaccessevent "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/workspace_access_event"
)

func TestCurrentUserReaderLoadsUserAndProfile(t *testing.T) {
	userID := uuid.New()
	firstName := "Ada"
	users := &fakeUserReader{result: userdomain.User{ID: userID}}
	profiles := &fakeProfileReader{result: userprofile.Profile{UserID: userID, FirstName: &firstName}}
	latestAccess := workspaceaccessevent.Event{UserID: userID, Workspace: workspaceaccessevent.WorkspaceApp}
	accessReader := &fakeWorkspaceAccessReader{result: latestAccess}
	reader := application.NewCurrentUserReader(users, profiles, accessReader)

	current, err := reader.GetByAuthUserID(context.Background(), "auth-user-1")
	if err != nil {
		t.Fatal(err)
	}
	if users.authUserID != "auth-user-1" || profiles.userID != userID || current.User.ID != userID || current.Profile.FirstName == nil || *current.Profile.FirstName != firstName || current.LastWorkspaceAccess == nil || current.LastWorkspaceAccess.Workspace != latestAccess.Workspace {
		t.Fatalf("current user = %+v; lookups = (%q, %s)", current, users.authUserID, profiles.userID)
	}
}

func TestCurrentUserReaderTreatsMissingWorkspaceHistoryAsEmpty(t *testing.T) {
	userID := uuid.New()
	users := &fakeUserReader{result: userdomain.User{ID: userID}}
	profiles := &fakeProfileReader{result: userprofile.Profile{UserID: userID}}
	accessReader := &fakeWorkspaceAccessReader{err: workspaceaccessevent.ErrEventNotFound}
	reader := application.NewCurrentUserReader(users, profiles, accessReader)

	current, err := reader.GetByAuthUserID(context.Background(), "auth-user-1")
	if err != nil {
		t.Fatal(err)
	}
	if current.LastWorkspaceAccess != nil {
		t.Fatalf("LastWorkspaceAccess = %+v, want nil", current.LastWorkspaceAccess)
	}
}

func TestCurrentUserReaderDoesNotLookupProfileWhenUserIsMissing(t *testing.T) {
	lookupErr := userdomain.ErrUserNotFound
	users := &fakeUserReader{err: lookupErr}
	profiles := &fakeProfileReader{}
	accessReader := &fakeWorkspaceAccessReader{}
	reader := application.NewCurrentUserReader(users, profiles, accessReader)

	if _, err := reader.GetByAuthUserID(context.Background(), "missing"); !errors.Is(err, lookupErr) {
		t.Fatalf("GetByAuthUserID error = %v, want ErrUserNotFound", err)
	}
	if profiles.called || accessReader.called {
		t.Fatal("dependent lookup called after user lookup failed")
	}
}

type fakeUserReader struct {
	authUserID string
	result     userdomain.User
	err        error
}

func (r *fakeUserReader) GetByAuthUserID(_ context.Context, authUserID string) (userdomain.User, error) {
	r.authUserID = authUserID
	return r.result, r.err
}

type fakeWorkspaceAccessReader struct {
	called bool
	userID uuid.UUID
	result workspaceaccessevent.Event
	err    error
}

func (r *fakeWorkspaceAccessReader) GetLatestByUserID(_ context.Context, userID uuid.UUID) (workspaceaccessevent.Event, error) {
	r.called, r.userID = true, userID
	return r.result, r.err
}

type fakeProfileReader struct {
	called bool
	userID uuid.UUID
	result userprofile.Profile
	err    error
}

func (r *fakeProfileReader) GetByUserID(_ context.Context, userID uuid.UUID) (userprofile.Profile, error) {
	r.called, r.userID = true, userID
	return r.result, r.err
}
