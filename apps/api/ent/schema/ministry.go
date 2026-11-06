package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
	commonmixin "github.com/hislifecitychurch/churchbase/apps/api/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/utilities"
)

type Ministry struct {
	ent.Schema
}

func (Ministry) Mixin() []ent.Mixin {
	return []ent.Mixin{
		commonmixin.Timestamps{},
		commonmixin.Audit{},
		commonmixin.SoftDelete{},
	}
}

func (Ministry) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"ministries_name_check": "length(trim(name)) > 0",
			"ministries_slug_check": "length(trim(slug)) > 0",
		}),
	}
}

func (Ministry) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.UUID("church_id", uuid.UUID{}).Immutable(),

		field.String("name").NotEmpty(),
		field.String("slug").NotEmpty(),
	}
}

func (Ministry) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("church", Church.Type).
			Ref("ministries").
			Field("church_id").
			Immutable().
			Unique().
			Required(),
		edge.To("ministry_memberships", MinistryMembership.Type),
	}
}

func (Ministry) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("church_id", "slug").
			Unique().
			StorageKey("ministries_church_slug_key"),
	}
}
