package user

import (
	"context"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
)

type CurrentUserService interface {
	GetByAuthUserID(context.Context, string) (application.CurrentUser, error)
}

type AccessContextsService interface {
	ListByAuthUserID(context.Context, string) ([]accesscontext.Context, error)
}

type Handler struct {
	currentUsers   CurrentUserService
	accessContexts AccessContextsService
}

func NewHandler(currentUsers CurrentUserService, accessContexts AccessContextsService) *Handler {
	return &Handler{currentUsers: currentUsers, accessContexts: accessContexts}
}
