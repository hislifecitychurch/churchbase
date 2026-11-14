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
	created := churchdomain.Church{
		ID: uuid.New(), Name: "Sample Church", Slug: "sample-church",
		Timezone: &timezone, Website: &website, Bio: &bio,
	}
	repository := &churchRepositoryFake{result: created}
	got, err := churchservice.NewService(repository).Create(context.Background(), churchdomain.CreateInput{
		Name: " Sample Church ", Slug: " sample-church ",
		Timezone: stringPointer(" America/Los_Angeles "), Website: stringPointer(" https://example.org "),
		Bio: stringPointer(" A welcoming church. "),
	})
	if err != nil {
		t.Fatal(err)
	}
	wantInput := churchdomain.CreateInput{
		Name: "Sample Church", Slug: "sample-church", Timezone: &timezone, Website: &website, Bio: &bio,
	}
	if got != created || !reflect.DeepEqual(repository.input, wantInput) {
		t.Fatalf("Create result = %+v, input = %+v, want %+v", got, repository.input, wantInput)
	}
}

func TestCreateTreatsBlankOptionalFieldsAsUnset(t *testing.T) {
	repository := &churchRepositoryFake{}
	_, err := churchservice.NewService(repository).Create(context.Background(), churchdomain.CreateInput{
		Name: "Sample Church", Slug: "sample", Timezone: stringPointer(" "), Website: stringPointer(""), Bio: stringPointer("  "),
	})
	if err != nil {
		t.Fatal(err)
	}
	if repository.input.Timezone != nil || repository.input.Website != nil || repository.input.Bio != nil {
		t.Fatalf("blank optional fields were not cleared: %+v", repository.input)
	}
}

func TestCreateRejectsInvalidTimezoneAndWebsite(t *testing.T) {
	for _, input := range []churchdomain.CreateInput{
		{Name: "Sample Church", Slug: "sample", Timezone: stringPointer("Not/A_Timezone")},
		{Name: "Sample Church", Slug: "sample", Website: stringPointer("javascript:alert(1)")},
		{Name: "Sample Church", Slug: "sample", Website: stringPointer("ftp://example.org")},
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
	input        churchdomain.CreateInput
	result       churchdomain.Church
	getAllResult []churchdomain.Church
	err          error
	getAllErr    error
}

func (r *churchRepositoryFake) Create(_ context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	r.called, r.input = true, input
	return r.result, r.err
}

func (r *churchRepositoryFake) GetAll(context.Context) ([]churchdomain.Church, error) {
	r.getAllCalled = true
	return r.getAllResult, r.getAllErr
}
