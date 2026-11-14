package church

import "github.com/google/uuid"

type Church struct {
	ID   uuid.UUID
	Name string
	Slug string
}

type CreateInput struct {
	Name string
	Slug string
}
