package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/schema/enum"
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
			"users_auth_user_id_check":              "auth_user_id IS NULL OR length(trim(auth_user_id)) > 0",
			"users_global_roles_check":              "global_roles IS NULL OR global_roles IN ('admin', 'staff')",
			"users_global_roles_auth_user_id_check": "global_roles IS NULL OR auth_user_id IS NOT NULL",
		}),
	}
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.String("auth_user_id").Optional().Nillable().NotEmpty(),

		field.Enum("global_roles").
			Values(enum.GlobalRoleAdmin, enum.GlobalRoleStaff).
			Optional().
			Nillable(),
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("profile", UserProfile.Type).Unique(),
		edge.To("church_memberships", ChurchMembership.Type),
		edge.To("workspace_access_events", WorkspaceAccessEvent.Type),
	}
}

func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("auth_user_id").
			Unique().
			StorageKey("users_auth_user_id_key"),
	}
}
