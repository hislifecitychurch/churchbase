package userprofile

import "github.com/google/uuid"

type Profile struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	FirstName *string
	LastName  *string
}

type Details struct {
	FirstName *string
	LastName  *string
}

type CreateInput struct {
	UserID uuid.UUID
	Details
}
