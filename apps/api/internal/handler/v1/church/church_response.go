package church

import churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"

type churchResponse struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Slug              string  `json:"slug"`
	Timezone          *string `json:"timezone"`
	Website           *string `json:"website"`
	Bio               *string `json:"bio"`
	City              *string `json:"city"`
	StateOrProvince   *string `json:"state_or_province"`
	CountryCode       *string `json:"country_code"`
	ProfileComplete   bool    `json:"profile_complete"`
	ActiveMemberCount int     `json:"active_member_count"`
	MinistryCount     int     `json:"ministry_count"`
}

func toChurchResponse(church churchdomain.Church) churchResponse {
	return churchResponse{
		ID: church.ID.String(), Name: church.Name, Slug: church.Slug,
		Timezone: church.Timezone, Website: church.Website, Bio: church.Bio,
		City: church.City, StateOrProvince: church.StateOrProvince, CountryCode: church.CountryCode,
		ProfileComplete:   church.IsProfileComplete(),
		ActiveMemberCount: church.ActiveMemberCount, MinistryCount: church.MinistryCount,
	}
}
