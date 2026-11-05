package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	commonmixin "github.com/hislifecitychurch/churchbase/apps/api/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/utilities"
)

type UserProfile struct {
	ent.Schema
}

func (UserProfile) Mixin() []ent.Mixin {
	return []ent.Mixin{
		commonmixin.Timestamps{},
		commonmixin.Audit{},
		commonmixin.SoftDelete{},
	}
}

func (UserProfile) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"user_profiles_first_name_check": "first_name IS NULL OR length(trim(first_name)) > 0",
			"user_profiles_last_name_check":  "last_name IS NULL OR length(trim(last_name)) > 0",
		}),
	}
}

func (UserProfile) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.UUID("user_id", uuid.UUID{}).Immutable(),

		field.String("first_name").Optional().Nillable().NotEmpty(),
		field.String("last_name").Optional().Nillable().NotEmpty(),
		field.String("bio").Optional().Nillable(),
		field.String("phone_number").Optional().Nillable(),
		field.Time("date_of_birth").
			Optional().
			Nillable().
			SchemaType(map[string]string{dialect.Postgres: "date"}),
		field.String("address_line_1").Optional().Nillable(),
		field.String("address_line_2").Optional().Nillable(),
		field.String("city").Optional().Nillable(),
		field.String("state_province").Optional().Nillable(),
		field.String("postal_code").Optional().Nillable(),
		field.String("country_code").MaxLen(2).Optional().Nillable(),
		field.String("emergency_contact_name").Optional().Nillable(),
		field.String("emergency_contact_relationship").Optional().Nillable(),
		field.String("emergency_contact_phone_number").Optional().Nillable(),
	}
}

func (UserProfile) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("profile").
			Field("user_id").
			Immutable().
			Unique().
			Required(),
	}
}
