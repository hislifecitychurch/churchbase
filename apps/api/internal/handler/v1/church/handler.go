package church

import (
	"context"

	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

type Creator interface {
	CreateByAuthUserID(context.Context, string, churchdomain.CreateInput) (churchdomain.Church, error)
}

type ChurchDirectoryReader interface {
	GetAllByAuthUserID(context.Context, string) ([]churchdomain.Church, error)
}

type Handler struct {
	creator   Creator
	directory ChurchDirectoryReader
}

func NewHandler(creator Creator, directory ChurchDirectoryReader) *Handler {
	return &Handler{creator: creator, directory: directory}
}
