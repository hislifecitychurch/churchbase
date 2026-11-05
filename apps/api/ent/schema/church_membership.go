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

type ChurchMembership struct {
	ent.Schema
}

func (ChurchMembership) Mixin() []ent.Mixin {
	return []ent.Mixin{
		commonmixin.Timestamps{},
		commonmixin.Audit{},
		commonmixin.SoftDelete{},
	}
}

func (ChurchMembership) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"church_memberships_role_check":   "role IN ('admin', 'member')",
			"church_memberships_status_check": "status IN ('active', 'inactive')",
		}),
	}
}

func (ChurchMembership) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.UUID("church_id", uuid.UUID{}).Immutable(),
		field.UUID("user_id", uuid.UUID{}).Immutable(),
		field.Enum("role").
			Values(enum.ChurchMembershipRoleAdmin, enum.ChurchMembershipRoleMember).
			Default(enum.ChurchMembershipRoleMember),
		field.Enum("status").
			Values(enum.MembershipStatusActive, enum.MembershipStatusInactive).
			Default(enum.MembershipStatusActive),
	}
}

func (ChurchMembership) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("church", Church.Type).
			Ref("church_memberships").
			Field("church_id").
			Immutable().
			Unique().
			Required(),
		edge.From("user", User.Type).
			Ref("church_memberships").
			Field("user_id").
			Immutable().
			Unique().
			Required(),
		edge.To("ministry_memberships", MinistryMembership.Type),
	}
}

func (ChurchMembership) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("church_id", "user_id").
			Unique().
			StorageKey("church_memberships_church_user_key"),
		index.Fields("user_id"),
	}
}
