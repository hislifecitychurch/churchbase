package utilities

import "github.com/google/uuid"

func NewUUIDv7() uuid.UUID {
	return uuid.Must(uuid.NewV7())
}
