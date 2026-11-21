package church

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entchurch "github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	entministry "github.com/hislifecitychurch/churchbase/apps/api/ent/ministry"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (r *ChurchRepository) GetByID(ctx context.Context, id uuid.UUID) (churchdomain.Church, error) {
	client := transaction.Client(ctx, r.client)
	record, err := client.Church.Query().Where(entchurch.ID(id)).Only(ctx)
	if entclient.IsNotFound(err) {
		return churchdomain.Church{}, churchdomain.ErrChurchNotFound
	}
	if err != nil {
		return churchdomain.Church{}, fmt.Errorf("get church by ID: %w", err)
	}

	activeMemberCount, err := client.ChurchMembership.Query().Where(
		churchmembership.ChurchID(id),
		churchmembership.StatusEQ(churchmembership.StatusActive),
		churchmembership.RoleEQ(churchmembership.RoleMember),
		churchmembership.HasUserWith(entuser.DeletedAtIsNil()),
	).Count(ctx)
	if err != nil {
		return churchdomain.Church{}, fmt.Errorf("count active church members: %w", err)
	}

	ministryCount, err := client.Ministry.Query().Where(
		entministry.ChurchID(id), entministry.DeletedAtIsNil(),
	).Count(ctx)
	if err != nil {
		return churchdomain.Church{}, fmt.Errorf("count church ministries: %w", err)
	}

	return churchdomain.Church{
		ID: record.ID, Name: record.Name, Slug: record.Slug,
		Timezone: record.Timezone, Website: record.Website, Bio: record.Bio,
		City: record.City, StateOrProvince: record.StateOrProvince, CountryCode: record.CountryCode,
		ActiveMemberCount: activeMemberCount, MinistryCount: ministryCount,
	}, nil
}
