package church

import "errors"

var (
	ErrInvalidChurch      = errors.New("invalid church")
	ErrChurchSlugConflict = errors.New("church slug already exists")
	ErrChurchNotFound     = errors.New("church not found")
)
