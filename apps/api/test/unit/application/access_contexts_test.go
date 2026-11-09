package application_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
)

func TestCurrentAccessContextsReaderUsesProvisionedAPIUserID(t *testing.T) {
	userID := uuid.New()
	users := &accessContextUserReaderFake{user: userdomain.User{ID: userID}}
	contexts := &accessContextReaderFake{result: []accesscontext.Context{{ID: uuid.New(), ChurchID: uuid.New(), Kind: accesscontext.KindChurch}}}
	reader := application.NewCurrentAccessContextsReader(users, contexts)

	result, err := reader.ListByAuthUserID(context.Background(), "opaque-auth-id")
	if err != nil {
		t.Fatal(err)
	}
	if users.authUserID != "opaque-auth-id" || contexts.userID != userID || len(result) != 1 {
		t.Fatalf("lookup auth user = %q, context user = %s, result = %+v", users.authUserID, contexts.userID, result)
	}
}

func TestCurrentAccessContextsReaderStopsWhenUserIsNotProvisioned(t *testing.T) {
	users := &accessContextUserReaderFake{err: userdomain.ErrUserNotFound}
	contexts := &accessContextReaderFake{}
	_, err := application.NewCurrentAccessContextsReader(users, contexts).ListByAuthUserID(context.Background(), "missing")
	if !errors.Is(err, userdomain.ErrUserNotFound) || contexts.called {
		t.Fatalf("error = %v, contexts called = %v", err, contexts.called)
	}
}

type accessContextUserReaderFake struct {
	user       userdomain.User
	authUserID string
	err        error
}

func (r *accessContextUserReaderFake) GetByAuthUserID(_ context.Context, authUserID string) (userdomain.User, error) {
	r.authUserID = authUserID
	return r.user, r.err
}

type accessContextReaderFake struct {
	userID uuid.UUID
	result []accesscontext.Context
	called bool
	err    error
}

func (r *accessContextReaderFake) ListByUserID(_ context.Context, userID uuid.UUID) ([]accesscontext.Context, error) {
	r.userID, r.called = userID, true
	return r.result, r.err
}
