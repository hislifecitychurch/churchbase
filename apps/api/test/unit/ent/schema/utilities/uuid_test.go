package utilities_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/utilities"
)

func TestNewUUIDv7(t *testing.T) {
	id := utilities.NewUUIDv7()
	if id.Version() != 7 {
		t.Fatalf("expected UUID version 7, got %d", id.Version())
	}
	if id.Variant() != uuid.RFC4122 {
		t.Fatalf("expected RFC 4122 variant, got %d", id.Variant())
	}
}
