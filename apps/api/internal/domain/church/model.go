package church

import (
	"strings"

	"github.com/google/uuid"
)

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
	// MinistryCount is derived from non-deleted church ministries.
	MinistryCount int
}

// IsProfileComplete reports whether a church has the required city, country, and time zone.
// shortcut: state/province applicability is not country-aware, add country-specific rules before requiring it.
func (c Church) IsProfileComplete() bool {
	return hasValue(c.City) && hasValue(c.CountryCode) && hasValue(c.Timezone)
}

func hasValue(value *string) bool {
	return value != nil && strings.TrimSpace(*value) != ""
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
