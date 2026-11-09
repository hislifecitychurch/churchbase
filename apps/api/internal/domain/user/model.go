package user

import "github.com/google/uuid"

type GlobalRole string

const (
	GlobalRoleAdmin GlobalRole = "admin"
	GlobalRoleStaff GlobalRole = "staff"
)

type User struct {
	ID          uuid.UUID
	AuthUserID  *string
	GlobalRoles *GlobalRole
}

type CreateInput struct {
	AuthUserID *string
}
