package church

import (
	"context"
	"fmt"

	entchurch "github.com/hislifecitychurch/churchbase/apps/api/ent/church"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/postgres/transaction"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
)

func (r *ChurchRepository) List(ctx context.Context) ([]churchdomain.Church, error) {
	records, err := transaction.Client(ctx, r.client).Church.Query().
		Order(entchurch.ByName()).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("list churches: %w", err)
	}

	churches := make([]churchdomain.Church, 0, len(records))
	for _, record := range records {
		churches = append(churches, churchdomain.Church{
			ID:   record.ID,
			Name: record.Name,
			Slug: record.Slug,
		})
	}
	return churches, nil
}
