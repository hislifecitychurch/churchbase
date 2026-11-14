package church

import (
	"context"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

type Creator interface {
	CreateByAuthUserID(context.Context, string, churchdomain.CreateInput) (churchdomain.Church, error)
}

type Handler struct {
	creator Creator
}

func NewHandler(creator Creator) *Handler {
	return &Handler{creator: creator}
}
