package transaction

import (
	"context"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
)

type contextKey struct{}

type txContext struct {
	client *entclient.Client
	tx     *entclient.Tx
}

func current(ctx context.Context, client *entclient.Client) (txContext, bool) {
	current, ok := ctx.Value(contextKey{}).(txContext)
	return current, ok && current.client == client
}
