package schema

import (
	"entgo.io/ent"
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

func (UserProfile) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.UUID("user_id", uuid.UUID{}).Immutable(),
		field.String("bio").Optional().Nillable(),
		field.String("phone_number").Optional().Nillable(),
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
