package church

import "github.com/google/uuid"

type Church struct {
	ID       uuid.UUID
	Name     string
	Slug     string
	Timezone *string
	Website  *string
	Bio      *string
}

type CreateInput struct {
	Name     string
	Slug     string
	Timezone *string
	Website  *string
	Bio      *string
}
