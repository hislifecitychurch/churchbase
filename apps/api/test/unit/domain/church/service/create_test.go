package service_test

import (
	"context"
	"errors"
	"reflect"
	"testing"

	"github.com/google/uuid"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	churchservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church/service"
)

func TestCreateRequiresNameAndSlug(t *testing.T) {
	for _, input := range []churchdomain.CreateInput{
		{},
		{Name: " ", Slug: "sample"},
		{Name: "Sample Church", Slug: "\t"},
	} {
		repository := &churchRepositoryFake{}
		_, err := churchservice.NewService(repository).Create(context.Background(), input)
		if !errors.Is(err, churchdomain.ErrInvalidChurch) || repository.called {
			t.Fatalf("Create(%+v) error = %v, repository called = %t", input, err, repository.called)
		}
	}
}

func TestCreateTrimsRequiredAndOptionalFields(t *testing.T) {
	timezone, website, bio := "America/Los_Angeles", "https://example.org", "A welcoming church."
	city, state, countryCode := "Springfield", "Illinois", "US"
	created := churchdomain.Church{
		ID: uuid.New(), Name: "Sample Church", Slug: "sample-church",
		Timezone: &timezone, Website: &website, Bio: &bio,
		City: &city, StateOrProvince: &state, CountryCode: &countryCode,
	}
	repository := &churchRepositoryFake{result: created}
	got, err := churchservice.NewService(repository).Create(context.Background(), churchdomain.CreateInput{
		Name: " Sample Church ", Slug: " sample-church ",
		Timezone: stringPointer(" America/Los_Angeles "), Website: stringPointer(" https://example.org "),
		Bio: stringPointer(" A welcoming church. "), City: stringPointer(" Springfield "),
		StateOrProvince: stringPointer(" Illinois "), CountryCode: stringPointer(" us "),
	})
	if err != nil {
		t.Fatal(err)
	}
	wantInput := churchdomain.CreateInput{
		Name: "Sample Church", Slug: "sample-church", Timezone: &timezone, Website: &website, Bio: &bio,
		City: &city, StateOrProvince: &state, CountryCode: &countryCode,
	}
	if got != created || !reflect.DeepEqual(repository.input, wantInput) {
		t.Fatalf("Create result = %+v, input = %+v, want %+v", got, repository.input, wantInput)
	}
}

func TestCreateTreatsBlankOptionalFieldsAsUnset(t *testing.T) {
	repository := &churchRepositoryFake{}
	_, err := churchservice.NewService(repository).Create(context.Background(), churchdomain.CreateInput{
		Name: "Sample Church", Slug: "sample", Timezone: stringPointer(" "), Website: stringPointer(""), Bio: stringPointer("  "),
		City: stringPointer(" "), StateOrProvince: stringPointer(""), CountryCode: stringPointer(" "),
	})
	if err != nil {
		t.Fatal(err)
	}
	if repository.input.Timezone != nil || repository.input.Website != nil || repository.input.Bio != nil || repository.input.City != nil || repository.input.StateOrProvince != nil || repository.input.CountryCode != nil {
		t.Fatalf("blank optional fields were not cleared: %+v", repository.input)
	}
}

func TestCreateRejectsInvalidTimezoneAndWebsite(t *testing.T) {
	for _, input := range []churchdomain.CreateInput{
		{Name: "Sample Church", Slug: "sample", Timezone: stringPointer("Not/A_Timezone")},
		{Name: "Sample Church", Slug: "sample", Website: stringPointer("javascript:alert(1)")},
		{Name: "Sample Church", Slug: "sample", Website: stringPointer("ftp://example.org")},
		{Name: "Sample Church", Slug: "sample", CountryCode: stringPointer("USA")},
		{Name: "Sample Church", Slug: "sample", CountryCode: stringPointer("1U")},
		{Name: "Sample Church", Slug: "sample", CountryCode: stringPointer("ß")},
	} {
		repository := &churchRepositoryFake{}
		if _, err := churchservice.NewService(repository).Create(context.Background(), input); !errors.Is(err, churchdomain.ErrInvalidChurch) || repository.called {
			t.Fatalf("Create(%+v) error = %v, repository called = %t", input, err, repository.called)
		}
	}
}

func stringPointer(value string) *string {
	return &value
}

type churchRepositoryFake struct {
	called       bool
	getAllCalled bool
	updateCalled bool
	input        churchdomain.CreateInput
	updateID     uuid.UUID
	updateInput  churchdomain.UpdateInput
	result       churchdomain.Church
	getAllResult []churchdomain.Church
	err          error
	getAllErr    error
	updateErr    error
}

func (r *churchRepositoryFake) Create(_ context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	r.called, r.input = true, input
	return r.result, r.err
}

func (r *churchRepositoryFake) Update(_ context.Context, id uuid.UUID, input churchdomain.UpdateInput) error {
	r.updateCalled, r.updateID, r.updateInput = true, id, input
	return r.updateErr
}

func (r *churchRepositoryFake) GetAll(context.Context) ([]churchdomain.Church, error) {
	r.getAllCalled = true
	return r.getAllResult, r.getAllErr
}
