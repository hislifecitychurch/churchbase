package userprofile

import "github.com/google/uuid"

type Profile struct {
	ID     uuid.UUID
	UserID uuid.UUID
}

type CreateInput struct {
	UserID uuid.UUID
}
