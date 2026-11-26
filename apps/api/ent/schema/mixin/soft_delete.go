package mixin

import (
	"context"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	entmixin "entgo.io/ent/schema/mixin"
)

type SoftDelete struct {
	entmixin.Schema
}

func (SoftDelete) Fields() []ent.Field {
	return []ent.Field{
		field.Time("deleted_at").Optional().Nillable(),
		field.String("deleted_by").Optional().Nillable(),
	}
}

type includeDeletedKey struct{}

func IncludeDeleted(ctx context.Context) context.Context {
	return context.WithValue(ctx, includeDeletedKey{}, true)
}

func IncludesDeleted(ctx context.Context) bool {
	include, _ := ctx.Value(includeDeletedKey{}).(bool)
	return include
}
