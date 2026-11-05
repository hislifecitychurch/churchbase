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
	firstName, lastName := "Ada", "Lovelace"
	expected := userprofile.Profile{ID: uuid.New(), UserID: userID, FirstName: &firstName, LastName: &lastName}
	repository := &fakeRepository{result: expected}
	service := profileservice.NewService(repository)

	created, err := service.Create(context.Background(), userprofile.CreateInput{
		UserID: userID,
		Details: userprofile.Details{
			FirstName: &firstName,
			LastName:  &lastName,
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	if !repository.called || repository.input.UserID != userID {
		t.Fatalf("repository state = (called %t, input %+v), want user ID %s", repository.called, repository.input, userID)
	}
	if created.ID != expected.ID || created.UserID != userID || created.FirstName == nil || *created.FirstName != firstName || created.LastName == nil || *created.LastName != lastName {
		t.Fatalf("created profile = %+v, want %+v", created, expected)
	}
}

func TestServiceCreateRejectsInvalidInput(t *testing.T) {
	blank := " \t "
	tests := []struct {
		name  string
		input userprofile.CreateInput
	}{
		{name: "missing user ID"},
		{name: "blank first name", input: userprofile.CreateInput{UserID: uuid.New(), Details: userprofile.Details{FirstName: &blank}}},
		{name: "blank last name", input: userprofile.CreateInput{UserID: uuid.New(), Details: userprofile.Details{LastName: &blank}}},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			repository := &fakeRepository{}
			service := profileservice.NewService(repository)
			if _, err := service.Create(context.Background(), test.input); !errors.Is(err, userprofile.ErrInvalidProfile) {
				t.Fatalf("Create error = %v, want ErrInvalidProfile", err)
			}
			if repository.called {
				t.Fatal("repository Create called for invalid input")
			}
		})
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
