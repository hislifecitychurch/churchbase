package userprofile

import "errors"

var (
	ErrInvalidProfile  = errors.New("invalid user profile")
	ErrProfileNotFound = errors.New("user profile not found")
)
