package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
)

func TestServiceCreate(t *testing.T) {
	firstName := "Directory"
	expected := userdomain.User{ID: uuid.New(), FirstName: &firstName}
	repository := &fakeRepository{result: expected}
	service := userservice.NewService(repository)

	created, err := service.Create(context.Background(), userdomain.CreateInput{FirstName: &firstName})
	if err != nil {
		t.Fatal(err)
	}
	if !repository.called {
		t.Fatal("repository Create was not called")
	}
	if repository.input.FirstName == nil || *repository.input.FirstName != firstName {
		t.Fatalf("repository first name = %v, want %q", repository.input.FirstName, firstName)
	}
	if repository.input.AuthUserID != nil {
		t.Fatalf("repository AuthUserID = %v, want nil", repository.input.AuthUserID)
	}
	if created.ID != expected.ID {
		t.Fatalf("created ID = %s, want %s", created.ID, expected.ID)
	}
}

func TestServiceRejectsBlankProvidedFields(t *testing.T) {
	blank := "  \t "
	tests := []struct {
		name  string
		input userdomain.CreateInput
	}{
		{name: "auth user ID", input: userdomain.CreateInput{AuthUserID: &blank}},
		{name: "first name", input: userdomain.CreateInput{FirstName: &blank}},
		{name: "last name", input: userdomain.CreateInput{LastName: &blank}},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			repository := &fakeRepository{}
			service := userservice.NewService(repository)

			if _, err := service.Create(context.Background(), test.input); !errors.Is(err, userdomain.ErrInvalidUser) {
				t.Fatalf("Create error = %v, want ErrInvalidUser", err)
			}
			if repository.called {
				t.Fatal("repository Create called for invalid input")
			}
		})
	}
}

type fakeRepository struct {
	called bool
	input  userdomain.CreateInput
	result userdomain.User
}

func (r *fakeRepository) Create(_ context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	r.called = true
	r.input = input
	return r.result, nil
}
