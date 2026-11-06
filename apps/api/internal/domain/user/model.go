package user

import "github.com/google/uuid"

type PlatformRole string

const (
	PlatformRoleAdmin PlatformRole = "admin"
	PlatformRoleStaff PlatformRole = "staff"
)

type User struct {
	ID           uuid.UUID
	AuthUserID   *string
	PlatformRole *PlatformRole
}

type CreateInput struct {
	AuthUserID *string
}
