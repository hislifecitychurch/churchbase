package workspaceaccessevent

import (
	"time"

	"github.com/google/uuid"
)

type Workspace string

const (
	WorkspaceApp      Workspace = "app"
	WorkspacePlatform Workspace = "platform"
)

type Event struct {
	ID         uuid.UUID
	UserID     uuid.UUID
	EntryID    uuid.UUID
	Workspace  Workspace
	OccurredAt time.Time
}

type RecordInput struct {
	UserID    uuid.UUID
	EntryID   uuid.UUID
	Workspace Workspace
}

type GetAllFilter struct {
	Workspace *Workspace
	Since     *time.Time
	Until     *time.Time
	Page      int
	Limit     int
}

type Page struct {
	Events []Event
	Total  int
}
