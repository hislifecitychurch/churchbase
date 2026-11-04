package actor

import "context"

type idKey struct{}

func WithID(ctx context.Context, id string) context.Context {
	if id == "" {
		return ctx
	}
	return context.WithValue(ctx, idKey{}, id)
}

func ID(ctx context.Context) (string, bool) {
	id, ok := ctx.Value(idKey{}).(string)
	return id, ok && id != ""
}
