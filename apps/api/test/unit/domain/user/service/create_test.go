package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user/service"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

func TestServiceCreateCreatesProfileAfterUser(t *testing.T) {
	firstName := "Directory"
	expected := userdomain.User{ID: uuid.New()}
	calls := []string{}
	repository := &fakeRepository{result: expected, calls: &calls}
	profiles := &fakeProfileCreator{calls: &calls}
	transactions := &fakeTransactionRunner{}
	service := userservice.NewService(repository, profiles, transactions)

	created, err := service.Create(context.Background(), userdomain.CreateInput{}, userprofile.Details{FirstName: &firstName})
	if err != nil {
		t.Fatal(err)
	}
	if !repository.called {
		t.Fatal("repository Create was not called")
	}
	if !profiles.called || profiles.input.UserID != expected.ID || profiles.input.FirstName == nil || *profiles.input.FirstName != firstName {
		t.Fatalf("profile Create input = %+v, want user ID %s and first name %q", profiles.input, expected.ID, firstName)
	}
	if !transactions.called || !transactions.committed {
		t.Fatalf("transaction state = (%t, %t), want called and committed", transactions.called, transactions.committed)
	}
	if len(calls) != 2 || calls[0] != "user" || calls[1] != "profile" {
		t.Fatalf("creation order = %v, want [user profile]", calls)
	}
	if repository.input.AuthUserID != nil {
		t.Fatalf("repository AuthUserID = %v, want nil", repository.input.AuthUserID)
	}
	if created.ID != expected.ID {
		t.Fatalf("created ID = %s, want %s", created.ID, expected.ID)
	}
}

func TestServiceRejectsBlankAuthUserID(t *testing.T) {
	blank := "  \t "
	repository := &fakeRepository{}
	transactions := &fakeTransactionRunner{}
	service := userservice.NewService(repository, &fakeProfileCreator{}, transactions)

	if _, err := service.Create(context.Background(), userdomain.CreateInput{AuthUserID: &blank}, userprofile.Details{}); !errors.Is(err, userdomain.ErrInvalidUser) {
		t.Fatalf("Create error = %v, want ErrInvalidUser", err)
	}
	if repository.called || transactions.called {
		t.Fatal("creation started for invalid Auth user ID")
	}
}

func TestServiceCreateDoesNotCommitWhenProfileCreationFails(t *testing.T) {
	profileErr := errors.New("profile repository failed")
	repository := &fakeRepository{result: userdomain.User{ID: uuid.New()}}
	profiles := &fakeProfileCreator{err: profileErr}
	transactions := &fakeTransactionRunner{}
	service := userservice.NewService(repository, profiles, transactions)

	if _, err := service.Create(context.Background(), userdomain.CreateInput{}, userprofile.Details{}); !errors.Is(err, profileErr) {
		t.Fatalf("Create error = %v, want profile error", err)
	}
	if !repository.called || !profiles.called || transactions.committed {
		t.Fatalf("failure state = (user: %t, profile: %t, committed: %t), want (true, true, false)", repository.called, profiles.called, transactions.committed)
	}
}

type fakeRepository struct {
	called              bool
	platformAdminCalled bool
	input               userdomain.CreateInput
	result              userdomain.User
	calls               *[]string
}

func (r *fakeRepository) Create(_ context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	r.called = true
	r.input = input
	if r.calls != nil {
		*r.calls = append(*r.calls, "user")
	}
	return r.result, nil
}

func (r *fakeRepository) CreatePlatformAdmin(_ context.Context, input userdomain.CreateInput) (userdomain.User, error) {
	r.platformAdminCalled = true
	r.input = input
	if r.calls != nil {
		*r.calls = append(*r.calls, "platform admin")
	}
	return r.result, nil
}

func (r *fakeRepository) GetByAuthUserID(context.Context, string) (userdomain.User, error) {
	return r.result, nil
}

type fakeProfileCreator struct {
	called bool
	input  userprofile.CreateInput
	err    error
	calls  *[]string
}

func (r *fakeProfileCreator) Create(_ context.Context, input userprofile.CreateInput) (userprofile.Profile, error) {
	r.called = true
	r.input = input
	if r.calls != nil {
		*r.calls = append(*r.calls, "profile")
	}
	return userprofile.Profile{
		UserID:    input.UserID,
		FirstName: input.FirstName,
		LastName:  input.LastName,
	}, r.err
}

type fakeTransactionRunner struct {
	called    bool
	committed bool
}

func (r *fakeTransactionRunner) WithinTransaction(ctx context.Context, run func(context.Context) error) error {
	r.called = true
	if err := run(ctx); err != nil {
		return err
	}
	r.committed = true
	return nil
}
