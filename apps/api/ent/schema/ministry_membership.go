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

type MinistryMembership struct {
	ent.Schema
}

func (MinistryMembership) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Checks(map[string]string{
			"ministry_memberships_role_check":   "role IN ('leader', 'member')",
			"ministry_memberships_status_check": "status IN ('active', 'suspended')",
		}),
	}
}

func (MinistryMembership) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(utilities.NewUUIDv7).Immutable(),
		field.UUID("ministry_id", uuid.UUID{}).Immutable(),
		field.UUID("church_membership_id", uuid.UUID{}).Immutable(),
		field.Enum("role").
			Values(enum.MinistryMembershipRoleLeader, enum.MinistryMembershipRoleMember).
			Default(enum.MinistryMembershipRoleMember),
		field.Enum("status").
			Values(enum.MembershipStatusActive, enum.MembershipStatusSuspended).
			Default(enum.MembershipStatusActive),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (MinistryMembership) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("ministry", Ministry.Type).
			Ref("ministry_memberships").
			Field("ministry_id").
			Immutable().
			Unique().
			Required(),
		edge.From("church_membership", ChurchMembership.Type).
			Ref("ministry_memberships").
			Field("church_membership_id").
			Immutable().
			Unique().
			Required(),
	}
}

func (MinistryMembership) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("ministry_id", "church_membership_id").
			Unique().
			StorageKey("ministry_memberships_ministry_member_key"),
		index.Fields("church_membership_id"),
	}
}
