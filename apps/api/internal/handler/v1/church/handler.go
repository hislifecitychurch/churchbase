package church

import (
	"context"

	"github.com/google/uuid"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

type Creator interface {
	CreateByAuthUserID(context.Context, string, churchdomain.CreateInput) (churchdomain.Church, error)
}

type ChurchDirectoryReader interface {
	GetAllByAuthUserID(context.Context, string) ([]churchdomain.Church, error)
}

type Updater interface {
	UpdateByAuthUserID(context.Context, string, uuid.UUID, churchdomain.UpdateInput) error
}

type Handler struct {
	creator   Creator
	directory ChurchDirectoryReader
	updater   Updater
}

func NewHandler(creator Creator, directory ChurchDirectoryReader, updater Updater) *Handler {
	return &Handler{creator: creator, directory: directory, updater: updater}
}
