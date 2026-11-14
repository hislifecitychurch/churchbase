package service_test

import (
	"context"
	"errors"
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

func TestCreateTrimsRequiredFieldsAndReturnsRepositoryChurch(t *testing.T) {
	created := churchdomain.Church{ID: uuid.New(), Name: "Sample Church", Slug: "sample-church"}
	repository := &churchRepositoryFake{result: created}
	got, err := churchservice.NewService(repository).Create(context.Background(), churchdomain.CreateInput{
		Name: " Sample Church ", Slug: " sample-church ",
	})
	if err != nil {
		t.Fatal(err)
	}
	if got != created || repository.input != (churchdomain.CreateInput{Name: created.Name, Slug: created.Slug}) {
		t.Fatalf("Create result = %+v, input = %+v", got, repository.input)
	}
}

type churchRepositoryFake struct {
	called bool
	input  churchdomain.CreateInput
	result churchdomain.Church
	err    error
}

func (r *churchRepositoryFake) Create(_ context.Context, input churchdomain.CreateInput) (churchdomain.Church, error) {
	r.called, r.input = true, input
	return r.result, r.err
}
