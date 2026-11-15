package church

import "github.com/google/uuid"

type Church struct {
	ID              uuid.UUID
	Name            string
	Slug            string
	Timezone        *string
	Website         *string
	Bio             *string
	City            *string
	StateOrProvince *string
	CountryCode     *string
	// ActiveMemberCount is derived from active member memberships.
	ActiveMemberCount int
}

type CreateInput struct {
	Name            string
	Slug            string
	Timezone        *string
	Website         *string
	Bio             *string
	City            *string
	StateOrProvince *string
	CountryCode     *string
}

type UpdateInput struct {
	Name            string
	Timezone        *string
	Website         *string
	Bio             *string
	City            *string
	StateOrProvince *string
	CountryCode     *string
}
