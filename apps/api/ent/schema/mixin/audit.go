package mixin

import (
	"context"
	"fmt"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	entmixin "entgo.io/ent/schema/mixin"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
)

type Audit struct {
	entmixin.Schema
}

func (Audit) Fields() []ent.Field {
	return []ent.Field{
		field.String("created_by").Optional().Nillable().Immutable(),
		field.String("updated_by").Optional().Nillable(),
	}
}

func (Audit) Hooks() []ent.Hook {
	return []ent.Hook{
		func(next ent.Mutator) ent.Mutator {
			return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
				id, ok := actor.ID(ctx)
				if !ok {
					return next.Mutate(ctx, m)
				}

				switch {
				case m.Op().Is(ent.OpCreate):
					mutation, ok := m.(interface{ SetCreatedBy(string) })
					if !ok {
						return nil, fmt.Errorf("audit mixin: mutation %T does not support created_by", m)
					}
					mutation.SetCreatedBy(id)
				case m.Op().Is(ent.OpUpdateOne | ent.OpUpdate):
					mutation, ok := m.(interface{ SetUpdatedBy(string) })
					if !ok {
						return nil, fmt.Errorf("audit mixin: mutation %T does not support updated_by", m)
					}
					mutation.SetUpdatedBy(id)
				}
				return next.Mutate(ctx, m)
			})
		},
	}
}
