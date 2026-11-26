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

	result, err := reader.GetAllByAuthUserID(context.Background(), "opaque-auth-id")
	if err != nil {
		t.Fatal(err)
	}
	if users.authUserID != "opaque-auth-id" || contexts.userID != userID || len(result.Contexts) != 1 || result.GlobalRoles != nil {
		t.Fatalf("lookup auth user = %q, context user = %s, result = %+v", users.authUserID, contexts.userID, result)
	}
	if contexts.calledAll {
		t.Fatal("ordinary user unexpectedly received all contexts")
	}
}

func TestCurrentAccessContextsReaderGetsAllContextsForGlobalRoles(t *testing.T) {
	globalRole := userdomain.GlobalRoleAdmin
	users := &accessContextUserReaderFake{user: userdomain.User{ID: uuid.New(), GlobalRoles: &globalRole}}
	contexts := &accessContextReaderFake{allResult: []accesscontext.Context{{
		ID: uuid.New(), ChurchID: uuid.New(), Kind: accesscontext.KindMinistry, Type: "kids",
		Capabilities: []string{accesscontext.CapabilityKidsOverviewRead},
	}}}
	reader := application.NewCurrentAccessContextsReader(users, contexts)

	result, err := reader.GetAllByAuthUserID(context.Background(), "opaque-auth-id")
	if err != nil {
		t.Fatal(err)
	}
	if result.GlobalRoles == nil || *result.GlobalRoles != globalRole || len(result.Contexts) != 1 {
		t.Fatalf("global access contexts = %+v", result)
	}
	if result.Contexts[0].Role != "global_admin" || len(result.Contexts[0].Capabilities) == 0 {
		t.Fatalf("global context = %+v, want global role and capabilities", result.Contexts[0])
	}
	if !contexts.calledAll || contexts.called {
		t.Fatalf("all-context lookup = %t, membership lookup = %t", contexts.calledAll, contexts.called)
	}
}

func TestCurrentAccessContextsReaderStopsWhenUserIsNotProvisioned(t *testing.T) {
	users := &accessContextUserReaderFake{err: userdomain.ErrUserNotFound}
	contexts := &accessContextReaderFake{}
	_, err := application.NewCurrentAccessContextsReader(users, contexts).GetAllByAuthUserID(context.Background(), "missing")
	if !errors.Is(err, userdomain.ErrUserNotFound) || contexts.called || contexts.calledAll {
		t.Fatalf("error = %v, membership called = %v, all called = %v", err, contexts.called, contexts.calledAll)
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
	userID    uuid.UUID
	result    []accesscontext.Context
	allResult []accesscontext.Context
	called    bool
	calledAll bool
	err       error
}

func (r *accessContextReaderFake) GetAllByUserID(_ context.Context, userID uuid.UUID) ([]accesscontext.Context, error) {
	r.userID, r.called = userID, true
	return r.result, r.err
}

func (r *accessContextReaderFake) GetAll(context.Context) ([]accesscontext.Context, error) {
	r.calledAll = true
	return r.allResult, r.err
}
