package transaction

import (
	"context"
	"errors"
	"fmt"

	entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"
)

type contextKey struct{}

type txContext struct {
	client *entclient.Client
	tx     *entclient.Tx
}

func Within(ctx context.Context, client *entclient.Client, run func(context.Context) error) (runErr error) {
	if _, ok := current(ctx, client); ok {
		return run(ctx)
	}

	tx, err := client.Tx(ctx)
	if err != nil {
		return fmt.Errorf("begin database transaction: %w", err)
	}
	finished := false
	defer func() {
		if !finished {
			if rollbackErr := tx.Rollback(); rollbackErr != nil {
				runErr = errors.Join(runErr, fmt.Errorf("rollback database transaction: %w", rollbackErr))
			}
		}
	}()

	txCtx := context.WithValue(ctx, contextKey{}, txContext{client: client, tx: tx})
	if runErr = run(txCtx); runErr != nil {
		return runErr
	}
	if err := tx.Commit(); err != nil {
		finished = true
		return fmt.Errorf("commit database transaction: %w", err)
	}
	finished = true
	return nil
}

func Client(ctx context.Context, client *entclient.Client) *entclient.Client {
	if current, ok := current(ctx, client); ok {
		return current.tx.Client()
	}
	return client
}

func current(ctx context.Context, client *entclient.Client) (txContext, bool) {
	current, ok := ctx.Value(contextKey{}).(txContext)
	return current, ok && current.client == client
}
