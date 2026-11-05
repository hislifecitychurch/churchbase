package user

import "github.com/google/uuid"

type User struct {
	ID         uuid.UUID
	AuthUserID *string
	FirstName  *string
	LastName   *string
}

type CreateInput struct {
	AuthUserID *string
	FirstName  *string
	LastName   *string
}
