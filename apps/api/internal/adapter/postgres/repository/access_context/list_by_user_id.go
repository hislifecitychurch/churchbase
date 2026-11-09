package access_context

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/ministrymembership"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
)

func (r *AccessContextRepository) ListByUserID(ctx context.Context, userID uuid.UUID) ([]accesscontext.MembershipContext, error) {
	memberships, err := transaction.Client(ctx, r.client).ChurchMembership.Query().
		Where(churchmembership.UserID(userID), churchmembership.StatusEQ(churchmembership.StatusActive)).
		WithChurch().
		WithMinistryMemberships(func(query *entclient.MinistryMembershipQuery) {
			query.Where(ministrymembership.StatusEQ(ministrymembership.StatusActive)).WithMinistry()
		}).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("list active church memberships for access contexts: %w", err)
	}

	contexts := make([]accesscontext.MembershipContext, 0, len(memberships))
	for _, membership := range memberships {
		church := membership.Edges.Church
		if church == nil {
			continue
		}
		contexts = append(contexts, accesscontext.MembershipContext{
			ID:         church.ID,
			ChurchID:   church.ID,
			Kind:       accesscontext.KindChurch,
			Slug:       "churchbase",
			Name:       "Church-wide",
			ChurchName: church.Name,
			Role:       string(membership.Role),
		})

		for _, ministryMembership := range membership.Edges.MinistryMemberships {
			ministry := ministryMembership.Edges.Ministry
			if ministry == nil || ministry.ChurchID != membership.ChurchID {
				continue
			}
			contexts = append(contexts, accesscontext.MembershipContext{
				ID:         ministry.ID,
				ChurchID:   church.ID,
				Kind:       accesscontext.KindMinistry,
				Slug:       ministry.Slug,
				Name:       ministry.Name,
				ChurchName: church.Name,
				Role:       string(ministryMembership.Role),
			})
		}
	}
	return contexts, nil
}

func (r *AccessContextRepository) ListAll(ctx context.Context) ([]accesscontext.MembershipContext, error) {
	churches, err := transaction.Client(ctx, r.client).Church.Query().WithMinistries().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("list all churches and ministries for global access contexts: %w", err)
	}

	contexts := make([]accesscontext.MembershipContext, 0, len(churches))
	for _, church := range churches {
		contexts = append(contexts, accesscontext.MembershipContext{
			ID:         church.ID,
			ChurchID:   church.ID,
			Kind:       accesscontext.KindChurch,
			Slug:       "churchbase",
			Name:       "Church-wide",
			ChurchName: church.Name,
		})

		for _, ministry := range church.Edges.Ministries {
			if ministry.ChurchID != church.ID {
				continue
			}
			contexts = append(contexts, accesscontext.MembershipContext{
				ID:         ministry.ID,
				ChurchID:   church.ID,
				Kind:       accesscontext.KindMinistry,
				Slug:       ministry.Slug,
				Name:       ministry.Name,
				ChurchName: church.Name,
			})
		}
	}
	return contexts, nil
}
