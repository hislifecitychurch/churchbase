package transaction

import (
	"context"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
)

func Client(ctx context.Context, client *entclient.Client) *entclient.Client {
	if current, ok := current(ctx, client); ok {
		return current.tx.Client()
	}
	return client
}
