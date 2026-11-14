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

func TestUpdateTrimsChurchNameAndOptionalFields(t *testing.T) {
	timezone, website, bio := "America/Chicago", "https://example.org", "A welcoming church."
	repository := &churchRepositoryFake{}
	churchID := uuid.New()

	err := churchservice.NewService(repository).Update(context.Background(), churchID, churchdomain.UpdateInput{
		Name: " Updated Church ", Timezone: stringPointer(" America/Chicago "),
		Website: stringPointer(" https://example.org "), Bio: stringPointer(" A welcoming church. "),
	})
	if err != nil {
		t.Fatal(err)
	}
	want := churchdomain.UpdateInput{Name: "Updated Church", Timezone: &timezone, Website: &website, Bio: &bio}
	if !repository.updateCalled || repository.updateID != churchID || !reflect.DeepEqual(repository.updateInput, want) {
		t.Fatalf("update called = %t, ID = %s, input = %+v, want %+v", repository.updateCalled, repository.updateID, repository.updateInput, want)
	}
}

func TestUpdateRejectsInvalidInputBeforeRepository(t *testing.T) {
	for _, input := range []churchdomain.UpdateInput{
		{Name: " "},
		{Name: "Church", Timezone: stringPointer("Not/A_Timezone")},
		{Name: "Church", Website: stringPointer("javascript:alert(1)")},
	} {
		repository := &churchRepositoryFake{}
		if err := churchservice.NewService(repository).Update(context.Background(), uuid.New(), input); !errors.Is(err, churchdomain.ErrInvalidChurch) || repository.updateCalled {
			t.Fatalf("Update(%+v) error = %v, repository called = %t", input, err, repository.updateCalled)
		}
	}
}

func TestUpdatePropagatesNotFound(t *testing.T) {
	repository := &churchRepositoryFake{updateErr: churchdomain.ErrChurchNotFound}
	err := churchservice.NewService(repository).Update(context.Background(), uuid.New(), churchdomain.UpdateInput{Name: "Church"})
	if !errors.Is(err, churchdomain.ErrChurchNotFound) {
		t.Fatalf("Update error = %v, want ErrChurchNotFound", err)
	}
}
