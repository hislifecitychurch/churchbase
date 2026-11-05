package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	profileservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile/service"
)

func TestServiceGetByUserID(t *testing.T) {
	userID := uuid.New()
	expected := userprofile.Profile{ID: uuid.New(), UserID: userID}
	repository := &profileLookupRepository{result: expected}
	service := profileservice.NewService(repository)

	profile, err := service.GetByUserID(context.Background(), userID)
	if err != nil {
		t.Fatal(err)
	}
	if !repository.called || repository.userID != userID || profile.ID != expected.ID {
		t.Fatalf("lookup = (%t, %s, %+v), want user ID %s and profile %+v", repository.called, repository.userID, profile, userID, expected)
	}
}

func TestServiceGetByUserIDRejectsNilID(t *testing.T) {
	repository := &profileLookupRepository{}
	service := profileservice.NewService(repository)

	if _, err := service.GetByUserID(context.Background(), uuid.Nil); !errors.Is(err, userprofile.ErrInvalidProfile) {
		t.Fatalf("GetByUserID error = %v, want ErrInvalidProfile", err)
	}
	if repository.called {
		t.Fatal("repository called with nil user ID")
	}
}

type profileLookupRepository struct {
	called bool
	userID uuid.UUID
	result userprofile.Profile
	err    error
}

func (r *profileLookupRepository) Create(context.Context, userprofile.CreateInput) (userprofile.Profile, error) {
	return userprofile.Profile{}, nil
}

func (r *profileLookupRepository) GetByUserID(_ context.Context, userID uuid.UUID) (userprofile.Profile, error) {
	r.called, r.userID = true, userID
	return r.result, r.err
}
