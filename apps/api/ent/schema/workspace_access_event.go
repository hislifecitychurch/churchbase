package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/enum"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/utilities"
)

type WorkspaceAccessEvent struct {
	ent.Schema
}

func (WorkspaceAccessEvent) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"workspace_access_events_workspace_check": "workspace IN ('app', 'platform')",
		}),
	}
}

func (WorkspaceAccessEvent) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.UUID("user_id", uuid.UUID{}).Immutable(),
		field.UUID("entry_id", uuid.UUID{}).Immutable(),

		field.Enum("workspace").
			Values(enum.WorkspaceApp, enum.WorkspacePlatform).
			Immutable(),
		field.Time("occurred_at").Default(func() time.Time { return time.Now().UTC() }).Immutable(),
	}
}

func (WorkspaceAccessEvent) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("workspace_access_events").
			Field("user_id").
			Immutable().
			Unique().
			Required(),
	}
}

func (WorkspaceAccessEvent) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("user_id", "workspace", "entry_id").
			Unique().
			StorageKey("workspace_access_events_user_workspace_entry_key"),
		index.Fields("user_id", "occurred_at").
			StorageKey("workspace_access_events_user_id_occurred_at"),
		index.Fields("workspace", "occurred_at").
			StorageKey("workspace_access_events_workspace_occurred_at"),
	}
}
