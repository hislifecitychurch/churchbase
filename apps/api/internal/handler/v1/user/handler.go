package user

import (
	"context"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
)

type CurrentUserService interface {
	GetByAuthUserID(context.Context, string) (application.CurrentUser, error)
}

type AccessContextsService interface {
	GetAllByAuthUserID(context.Context, string) (application.CurrentAccessContexts, error)
}

type Handler struct {
	currentUsers   CurrentUserService
	accessContexts AccessContextsService
}

func NewHandler(currentUsers CurrentUserService, accessContexts AccessContextsService) *Handler {
	return &Handler{currentUsers: currentUsers, accessContexts: accessContexts}
}
