package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	commonmixin "github.com/hislifecitychurch/churchbase/apps/api/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/utilities"
)

type Church struct {
	ent.Schema
}

func (Church) Mixin() []ent.Mixin {
	return []ent.Mixin{
		commonmixin.Timestamps{},
		commonmixin.Audit{},
		commonmixin.SoftDelete{},
	}
}

func (Church) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"churches_country_code_check": "country_code IS NULL OR (length(country_code) = 2 AND country_code = upper(country_code) AND substr(country_code, 1, 1) BETWEEN 'A' AND 'Z' AND substr(country_code, 2, 1) BETWEEN 'A' AND 'Z')",
		}),
	}
}

func (Church) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),

		field.String("name"),
		field.String("slug").Unique(),
		field.String("timezone").Optional().Nillable(),
		field.String("website").Optional().Nillable(),
		field.String("bio").Optional().Nillable(),
		field.String("city").Optional().Nillable(),
		field.String("state_or_province").Optional().Nillable(),
		field.String("country_code").MaxLen(2).Optional().Nillable(),
	}
}

func (Church) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("church_memberships", ChurchMembership.Type),
		edge.To("ministries", Ministry.Type),
	}
}
