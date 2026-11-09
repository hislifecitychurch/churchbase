package service

import (
	"context"
	"sort"

	"github.com/google/uuid"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
)

func (s *Service) ListByUserID(ctx context.Context, userID uuid.UUID) ([]accesscontext.Context, error) {
	memberships, err := s.repository.ListByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	contexts := make([]accesscontext.Context, 0, len(memberships))
	for _, membership := range memberships {
		capabilities := capabilitiesFor(membership)
		if len(capabilities) == 0 {
			continue
		}
		contexts = append(contexts, accesscontext.Context{
			ID:           membership.ID,
			ChurchID:     membership.ChurchID,
			Kind:         membership.Kind,
			Slug:         membership.Slug,
			Name:         membership.Name,
			ChurchName:   membership.ChurchName,
			Role:         membership.Role,
			Capabilities: capabilities,
		})
	}

	sort.Slice(contexts, func(i, j int) bool {
		if contexts[i].Kind != contexts[j].Kind {
			return contexts[i].Kind == accesscontext.KindChurch
		}
		if contexts[i].ChurchName != contexts[j].ChurchName {
			return contexts[i].ChurchName < contexts[j].ChurchName
		}
		if contexts[i].Name != contexts[j].Name {
			return contexts[i].Name < contexts[j].Name
		}
		return contexts[i].ID.String() < contexts[j].ID.String()
	})
	return contexts, nil
}

// shortcut: extra grants are not stored yet, add persisted grants before enabling Care, Kids check-in/safety, or Church-wide Ministries for staff.
func capabilitiesFor(membership accesscontext.MembershipContext) []string {
	if membership.Kind == accesscontext.KindChurch {
		switch membership.Role {
		case accesscontext.ChurchMembershipRoleAdmin:
			return []string{
				accesscontext.CapabilityChurchOverviewRead,
				accesscontext.CapabilityChurchPeopleRead,
				accesscontext.CapabilityChurchMinistriesRead,
			}
		case accesscontext.ChurchMembershipRoleStaff:
			return []string{
				accesscontext.CapabilityChurchOverviewRead,
				accesscontext.CapabilityChurchPeopleRead,
			}
		default:
			return nil
		}
	}

	if membership.Kind != accesscontext.KindMinistry {
		return nil
	}

	switch membership.Slug {
	case "broadcast":
		capabilities := []string{
			accesscontext.CapabilityBroadcastOverviewRead,
			accesscontext.CapabilityBroadcastServicesRead,
			accesscontext.CapabilityBroadcastMediaRead,
		}
		switch membership.Role {
		case accesscontext.MinistryMembershipRoleLead:
			return append(capabilities, accesscontext.CapabilityBroadcastTeamRead)
		case accesscontext.MinistryMembershipRoleMember:
			return capabilities
		default:
			return nil
		}
	case "music":
		capabilities := []string{
			accesscontext.CapabilityMusicOverviewRead,
			accesscontext.CapabilityMusicSongsRead,
			accesscontext.CapabilityMusicRehearsalsRead,
		}
		switch membership.Role {
		case accesscontext.MinistryMembershipRoleLead:
			return append(capabilities, accesscontext.CapabilityMusicTeamRead)
		case accesscontext.MinistryMembershipRoleMember:
			return capabilities
		default:
			return nil
		}
	case "kids":
		switch membership.Role {
		case accesscontext.MinistryMembershipRoleLead, accesscontext.MinistryMembershipRoleMember:
			return []string{
				accesscontext.CapabilityKidsOverviewRead,
				accesscontext.CapabilityKidsClassesRead,
			}
		default:
			return nil
		}
	default:
		return nil
	}
}
