package service_test

import (
	"context"
	"errors"
	"reflect"
	"testing"

	"github.com/google/uuid"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context/service"
)

func TestServiceListsRoleCapabilities(t *testing.T) {
	churchID := uuid.New()
	ministryID := uuid.New()
	repository := &contextRepositoryFake{contexts: []accesscontext.MembershipContext{
		{ID: churchID, ChurchID: churchID, Kind: accesscontext.KindChurch, Role: "staff", Name: "Church-wide"},
		{ID: ministryID, ChurchID: churchID, Kind: accesscontext.KindMinistry, Slug: "broadcast", Role: "lead", Name: "Broadcast"},
		{ID: uuid.New(), ChurchID: churchID, Kind: accesscontext.KindMinistry, Slug: "kids", Role: "member", Name: "Kids"},
		{ID: uuid.New(), ChurchID: churchID, Kind: accesscontext.KindMinistry, Slug: "unknown", Role: "lead", Name: "Unknown"},
		{ID: uuid.New(), ChurchID: churchID, Kind: accesscontext.KindMinistry, Slug: "broadcast", Role: "invalid", Name: "Invalid role"},
		{ID: uuid.New(), ChurchID: churchID, Kind: accesscontext.KindChurch, Role: "member", Name: "Church member"},
	}}
	contexts, err := service.NewService(repository).ListByUserID(context.Background(), uuid.New())
	if err != nil {
		t.Fatal(err)
	}
	if len(contexts) != 3 {
		t.Fatalf("got %d contexts, want 3: %+v", len(contexts), contexts)
	}
	if got, want := contexts[0].Capabilities, []string{accesscontext.CapabilityChurchOverviewRead, accesscontext.CapabilityChurchPeopleRead}; !reflect.DeepEqual(got, want) {
		t.Fatalf("staff capabilities = %v, want %v", got, want)
	}
	if got, want := contexts[1].Capabilities, []string{
		accesscontext.CapabilityBroadcastOverviewRead,
		accesscontext.CapabilityBroadcastServicesRead,
		accesscontext.CapabilityBroadcastMediaRead,
		accesscontext.CapabilityBroadcastTeamRead,
	}; !reflect.DeepEqual(got, want) {
		t.Fatalf("Broadcast lead capabilities = %v, want %v", got, want)
	}
	if got, want := contexts[2].Capabilities, []string{accesscontext.CapabilityKidsOverviewRead, accesscontext.CapabilityKidsClassesRead}; !reflect.DeepEqual(got, want) {
		t.Fatalf("Kids member capabilities = %v, want %v", got, want)
	}
}

func TestServiceListsAllContextsWithEveryCapability(t *testing.T) {
	churchID := uuid.New()
	repository := &contextRepositoryFake{allContexts: []accesscontext.MembershipContext{
		{ID: churchID, ChurchID: churchID, Kind: accesscontext.KindChurch, Name: "Church-wide"},
		{ID: uuid.New(), ChurchID: churchID, Kind: accesscontext.KindMinistry, Slug: "kids", Name: "Kids"},
	}}
	contexts, err := service.NewService(repository).ListAll(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if len(contexts) != 2 || len(contexts[0].Capabilities) != 16 || len(contexts[1].Capabilities) != 16 {
		t.Fatalf("global contexts = %+v, want all 16 capabilities per context", contexts)
	}
	for _, context := range contexts {
		for _, required := range []string{
			accesscontext.CapabilityChurchOverviewRead,
			accesscontext.CapabilityCareRead,
			accesscontext.CapabilityBroadcastTeamRead,
			accesscontext.CapabilityMusicTeamRead,
			accesscontext.CapabilityKidsCheckInRead,
			accesscontext.CapabilityKidsSafetyRead,
		} {
			if !contains(context.Capabilities, required) {
				t.Fatalf("global context %s is missing %q", context.Name, required)
			}
		}
	}
}

func TestServiceDoesNotGrantSensitiveCapabilitiesByRole(t *testing.T) {
	repository := &contextRepositoryFake{contexts: []accesscontext.MembershipContext{
		{ID: uuid.New(), ChurchID: uuid.New(), Kind: accesscontext.KindChurch, Role: "admin", Name: "Church-wide"},
		{ID: uuid.New(), ChurchID: uuid.New(), Kind: accesscontext.KindMinistry, Slug: "kids", Role: "lead", Name: "Kids"},
	}}
	contexts, err := service.NewService(repository).ListByUserID(context.Background(), uuid.New())
	if err != nil {
		t.Fatal(err)
	}
	for _, context := range contexts {
		for _, capability := range context.Capabilities {
			if capability == accesscontext.CapabilityCareRead || capability == accesscontext.CapabilityKidsCheckInRead || capability == accesscontext.CapabilityKidsSafetyRead {
				t.Fatalf("role %q received separately granted capability %q", context.Role, capability)
			}
		}
	}
}

func TestServiceReturnsRepositoryError(t *testing.T) {
	wantErr := errors.New("database unavailable")
	_, err := service.NewService(&contextRepositoryFake{err: wantErr}).ListByUserID(context.Background(), uuid.New())
	if !errors.Is(err, wantErr) {
		t.Fatalf("error = %v, want %v", err, wantErr)
	}
}

type contextRepositoryFake struct {
	contexts    []accesscontext.MembershipContext
	allContexts []accesscontext.MembershipContext
	err         error
}

func (r *contextRepositoryFake) ListByUserID(context.Context, uuid.UUID) ([]accesscontext.MembershipContext, error) {
	return r.contexts, r.err
}

func (r *contextRepositoryFake) ListAll(context.Context) ([]accesscontext.MembershipContext, error) {
	return r.allContexts, r.err
}

func contains(values []string, value string) bool {
	for _, candidate := range values {
		if candidate == value {
			return true
		}
	}
	return false
}
