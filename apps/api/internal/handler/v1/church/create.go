package church

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) Create(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, http.StatusUnauthorized, response.Failure[any](
			"Unauthorized", "unauthorized", c, "church.create.unauthorized", "", "warning",
		))
	}
	var request createRequest
	if err := c.BodyParser(&request); err != nil || strings.TrimSpace(request.Name) == "" || strings.TrimSpace(request.Slug) == "" {
		return invalidChurch(c)
	}

	created, err := h.creator.CreateByAuthUserID(c.UserContext(), authUserID, churchdomain.CreateInput{
		Name: request.Name, Slug: request.Slug,
		Timezone: request.Timezone, Website: request.Website, Bio: request.Bio,
		City: request.City, StateOrProvince: request.StateOrProvince, CountryCode: request.CountryCode,
	})
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "church.create.user.not_provisioned", "", "warning",
		))
	}
	if errors.Is(err, application.ErrChurchCreationForbidden) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"Global administrator access is required", "forbidden", c, "church.create.forbidden", "", "warning",
		))
	}
	if errors.Is(err, churchdomain.ErrInvalidChurch) {
		return invalidChurch(c)
	}
	if errors.Is(err, churchdomain.ErrChurchSlugConflict) {
		return response.JSON(c, http.StatusConflict, response.Failure[any](
			"A church with this slug already exists", "church_slug_conflict", c, "church.create.slug.conflict", "", "warning",
		))
	}
	if err != nil {
		log.Printf("church_create_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, http.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "church.create.failed", "", "error",
		))
	}

	return response.JSON(c, http.StatusCreated, response.Success(createResponse{
		ID: created.ID.String(), Name: created.Name, Slug: created.Slug,
		Timezone: created.Timezone, Website: created.Website, Bio: created.Bio,
		City: created.City, StateOrProvince: created.StateOrProvince, CountryCode: created.CountryCode,
		ActiveMemberCount: created.ActiveMemberCount,
	}, "Church created", c, "church.created", "", "info"))
}

type createRequest struct {
	Name            string  `json:"name"`
	Slug            string  `json:"slug"`
	Timezone        *string `json:"timezone"`
	Website         *string `json:"website"`
	Bio             *string `json:"bio"`
	City            *string `json:"city"`
	StateOrProvince *string `json:"state_or_province"`
	CountryCode     *string `json:"country_code"`
}

type createResponse struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Slug              string  `json:"slug"`
	Timezone          *string `json:"timezone"`
	Website           *string `json:"website"`
	Bio               *string `json:"bio"`
	City              *string `json:"city"`
	StateOrProvince   *string `json:"state_or_province"`
	CountryCode       *string `json:"country_code"`
	ActiveMemberCount int     `json:"active_member_count"`
}

func invalidChurch(c *fiber.Ctx) error {
	return response.JSON(c, http.StatusBadRequest, response.Failure[any](
		"Church name and slug are required; website, time zone, and country code must be valid", "invalid_church", c, "church.create.invalid", "", "warning",
	))
}
