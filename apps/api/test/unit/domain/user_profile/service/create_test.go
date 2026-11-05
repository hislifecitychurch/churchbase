package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
	profileservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile/service"
)

func TestServiceCreate(t *testing.T) {
	userID := uuid.New()
	repository := &fakeRepository{result: userprofile.Profile{ID: uuid.New(), UserID: userID}}
	service := profileservice.NewService(repository)

	created, err := service.Create(context.Background(), userprofile.CreateInput{UserID: userID})
	if err != nil {
		t.Fatal(err)
	}
	if !repository.called || repository.input.UserID != userID {
		t.Fatalf("repository state = (called %t, input %+v), want user ID %s", repository.called, repository.input, userID)
	}
	if created.ID != repository.result.ID || created.UserID != userID {
		t.Fatalf("created profile = %+v, want %+v", created, repository.result)
	}
}

func TestServiceCreateRejectsMissingUserID(t *testing.T) {
	repository := &fakeRepository{}
	service := profileservice.NewService(repository)

	if _, err := service.Create(context.Background(), userprofile.CreateInput{}); !errors.Is(err, userprofile.ErrInvalidProfile) {
		t.Fatalf("Create error = %v, want ErrInvalidProfile", err)
	}
	if repository.called {
		t.Fatal("repository Create called without a user ID")
	}
}

type fakeRepository struct {
	called bool
	input  userprofile.CreateInput
	result userprofile.Profile
}

func (r *fakeRepository) Create(_ context.Context, input userprofile.CreateInput) (userprofile.Profile, error) {
	r.called = true
	r.input = input
	return r.result, nil
}
