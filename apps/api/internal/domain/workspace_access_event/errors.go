package workspaceaccessevent

import "errors"

var (
	ErrEventNotFound = errors.New("workspace access event not found")
	ErrInvalidEvent  = errors.New("invalid workspace access event")
)
