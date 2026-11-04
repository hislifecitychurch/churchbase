package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/utilities"
)

// Church is the tenant boundary for Churchbase-owned records.
type Church struct {
	ent.Schema
}

func (Church) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.String("name"),
		field.String("slug").Unique(),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (Church) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("church_memberships", ChurchMembership.Type),
		edge.To("ministries", Ministry.Type),
	}
}
