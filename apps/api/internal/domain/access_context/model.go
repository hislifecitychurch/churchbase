package access_context

import "github.com/google/uuid"

type Kind string

const (
	KindChurch   Kind = "church"
	KindMinistry Kind = "ministry"
)

const (
	ChurchMembershipRoleAdmin    = "admin"
	ChurchMembershipRoleStaff    = "staff"
	MinistryMembershipRoleLead   = "lead"
	MinistryMembershipRoleMember = "member"
)

const (
	CapabilityChurchOverviewRead    = "church.overview.read"
	CapabilityChurchPeopleRead      = "church.people.read"
	CapabilityChurchMinistriesRead  = "church.ministries.read"
	CapabilityCareRead              = "care.read"
	CapabilityBroadcastOverviewRead = "broadcast.overview.read"
	CapabilityBroadcastServicesRead = "broadcast.services.read"
	CapabilityBroadcastMediaRead    = "broadcast.media.read"
	CapabilityBroadcastTeamRead     = "broadcast.team.read"
	CapabilityMusicOverviewRead     = "music.overview.read"
	CapabilityMusicSongsRead        = "music.songs.read"
	CapabilityMusicRehearsalsRead   = "music.rehearsals.read"
	CapabilityMusicTeamRead         = "music.team.read"
	CapabilityKidsOverviewRead      = "kids.overview.read"
	CapabilityKidsClassesRead       = "kids.classes.read"
	CapabilityKidsCheckInRead       = "kids.check-in.read"
	CapabilityKidsSafetyRead        = "kids.safety.read"
)

type Context struct {
	ID           uuid.UUID
	ChurchID     uuid.UUID
	Kind         Kind
	Slug         string
	Name         string
	ChurchName   string
	Role         string
	Capabilities []string
}

type MembershipContext struct {
	ID         uuid.UUID
	ChurchID   uuid.UUID
	Kind       Kind
	Slug       string
	Name       string
	ChurchName string
	Role       string
}
