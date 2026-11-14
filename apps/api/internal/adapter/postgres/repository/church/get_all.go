package church

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
	entchurch "github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/ent/churchmembership"
	entuser "github.com/hislifecitychurch/churchbase/apps/api/ent/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (r *ChurchRepository) GetAll(ctx context.Context) ([]churchdomain.Church, error) {
	client := transaction.Client(ctx, r.client)
	records, err := client.Church.Query().Order(entchurch.ByName()).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("get all churches: %w", err)
	}

	type memberCount struct {
		ChurchID uuid.UUID `json:"church_id"`
		Count    int       `json:"count"`
	}
	var counts []memberCount
	if err := client.ChurchMembership.Query().
		Where(
			churchmembership.StatusEQ(churchmembership.StatusActive),
			churchmembership.RoleEQ(churchmembership.RoleMember),
			churchmembership.HasUserWith(entuser.DeletedAtIsNil()),
		).
		GroupBy(churchmembership.FieldChurchID).
		Aggregate(entclient.Count()).
		Scan(ctx, &counts); err != nil {
		return nil, fmt.Errorf("count active church members: %w", err)
	}
	memberCounts := make(map[uuid.UUID]int, len(counts))
	for _, count := range counts {
		memberCounts[count.ChurchID] = count.Count
	}

	churches := make([]churchdomain.Church, 0, len(records))
	for _, record := range records {
		churches = append(churches, churchdomain.Church{
			ID: record.ID, Name: record.Name, Slug: record.Slug,
			Timezone: record.Timezone, Website: record.Website, Bio: record.Bio,
			ActiveMemberCount: memberCounts[record.ID],
		})
	}
	return churches, nil
}
