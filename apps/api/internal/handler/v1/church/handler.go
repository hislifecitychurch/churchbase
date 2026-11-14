package church

import (
	"context"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

type Creator interface {
	CreateByAuthUserID(context.Context, string, churchdomain.CreateInput) (churchdomain.Church, error)
}

type Lister interface {
	ListByAuthUserID(context.Context, string) ([]churchdomain.Church, error)
}

type Handler struct {
	creator Creator
	lister  Lister
}

func NewHandler(creator Creator, lister Lister) *Handler {
	return &Handler{creator: creator, lister: lister}
}
