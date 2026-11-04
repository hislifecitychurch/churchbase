package utilities

import (
	"testing"

	"github.com/google/uuid"
)

func TestNewUUIDv7(t *testing.T) {
	id := NewUUIDv7()
	if id.Version() != 7 {
		t.Fatalf("expected UUID version 7, got %d", id.Version())
	}
	if id.Variant() != uuid.RFC4122 {
		t.Fatalf("expected RFC 4122 variant, got %d", id.Variant())
	}
}
