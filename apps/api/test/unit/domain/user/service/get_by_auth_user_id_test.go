package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
)

func TestServiceGetByAuthUserID(t *testing.T) {
	expected := userdomain.User{ID: uuid.New()}
	repository := &userLookupRepository{result: expected}
	service := userservice.NewService(repository, &fakeProfileCreator{}, &fakeTransactionRunner{})

	user, err := service.GetByAuthUserID(context.Background(), "auth-user-1")
	if err != nil {
		t.Fatal(err)
	}
	if !repository.called || repository.authUserID != "auth-user-1" || user.ID != expected.ID {
		t.Fatalf("lookup = (%t, %q, %+v), want Auth user auth-user-1 and user %+v", repository.called, repository.authUserID, user, expected)
	}
}

func TestServiceGetByAuthUserIDRejectsBlankID(t *testing.T) {
	repository := &userLookupRepository{}
	service := userservice.NewService(repository, &fakeProfileCreator{}, &fakeTransactionRunner{})

	if _, err := service.GetByAuthUserID(context.Background(), " \t "); !errors.Is(err, userdomain.ErrInvalidUser) {
		t.Fatalf("GetByAuthUserID error = %v, want ErrInvalidUser", err)
	}
	if repository.called {
		t.Fatal("repository called with blank Auth user ID")
	}
}

type userLookupRepository struct {
	called     bool
	authUserID string
	result     userdomain.User
	err        error
}

func (r *userLookupRepository) Create(context.Context, userdomain.CreateInput) (userdomain.User, error) {
	return userdomain.User{}, nil
}

func (r *userLookupRepository) CreatePlatformAdmin(context.Context, userdomain.CreateInput) (userdomain.User, error) {
	return userdomain.User{}, nil
}

func (r *userLookupRepository) GetByAuthUserID(_ context.Context, authUserID string) (userdomain.User, error) {
	r.called, r.authUserID = true, authUserID
	return r.result, r.err
}
