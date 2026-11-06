package user

import (
	"context"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
)

type CurrentUserService interface {
	GetByAuthUserID(context.Context, string) (application.CurrentUser, error)
}

type Handler struct {
	currentUsers CurrentUserService
}

func NewHandler(currentUsers CurrentUserService) *Handler {
	return &Handler{currentUsers: currentUsers}
}
