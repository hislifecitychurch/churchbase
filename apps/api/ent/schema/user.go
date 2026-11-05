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

type User struct {
	ent.Schema
}

func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		commonmixin.Timestamps{},
		commonmixin.Audit{},
		commonmixin.SoftDelete{},
	}
}

func (User) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"users_first_name_check":   "first_name IS NULL OR length(trim(first_name)) > 0",
			"users_last_name_check":    "last_name IS NULL OR length(trim(last_name)) > 0",
			"users_auth_user_id_check": "auth_user_id IS NULL OR length(trim(auth_user_id)) > 0",
		}),
	}
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.String("auth_user_id").Optional().Nillable().NotEmpty(),
		field.String("first_name").Optional().Nillable().NotEmpty(),
		field.String("last_name").Optional().Nillable().NotEmpty(),
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("profile", UserProfile.Type).Unique(),
		edge.To("church_memberships", ChurchMembership.Type),
	}
}

func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("auth_user_id").
			Unique().
			StorageKey("users_auth_user_id_key"),
	}
}
