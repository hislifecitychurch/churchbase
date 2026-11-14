package service_test

import (
	"context"
	"reflect"
	"testing"

	"github.com/google/uuid"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	churchservice "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church/service"
)

func TestListReturnsRepositoryChurches(t *testing.T) {
	want := []churchdomain.Church{
		{ID: uuid.New(), Name: "Alpha Church", Slug: "alpha"},
		{ID: uuid.New(), Name: "Beta Church", Slug: "beta"},
	}
	repository := &churchRepositoryFake{listResult: want}
	got, err := churchservice.NewService(repository).List(context.Background())
	if err != nil || !reflect.DeepEqual(got, want) || !repository.listCalled {
		t.Fatalf("List() = %+v, %v; repository called = %t", got, err, repository.listCalled)
	}
}
