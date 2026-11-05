package application_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func TestCurrentUserReaderLoadsUserAndProfile(t *testing.T) {
	userID := uuid.New()
	firstName := "Ada"
	users := &fakeUserReader{result: userdomain.User{ID: userID}}
	profiles := &fakeProfileReader{result: userprofile.Profile{UserID: userID, FirstName: &firstName}}
	reader := application.NewCurrentUserReader(users, profiles)

	current, err := reader.GetByAuthUserID(context.Background(), "auth-user-1")
	if err != nil {
		t.Fatal(err)
	}
	if users.authUserID != "auth-user-1" || profiles.userID != userID || current.User.ID != userID || current.Profile.FirstName == nil || *current.Profile.FirstName != firstName {
		t.Fatalf("current user = %+v; lookups = (%q, %s)", current, users.authUserID, profiles.userID)
	}
}

func TestCurrentUserReaderDoesNotLookupProfileWhenUserIsMissing(t *testing.T) {
	lookupErr := userdomain.ErrUserNotFound
	users := &fakeUserReader{err: lookupErr}
	profiles := &fakeProfileReader{}
	reader := application.NewCurrentUserReader(users, profiles)

	if _, err := reader.GetByAuthUserID(context.Background(), "missing"); !errors.Is(err, lookupErr) {
		t.Fatalf("GetByAuthUserID error = %v, want ErrUserNotFound", err)
	}
	if profiles.called {
		t.Fatal("profile lookup called after user lookup failed")
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
