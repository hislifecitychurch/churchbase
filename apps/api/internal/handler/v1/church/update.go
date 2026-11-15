package church

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) Update(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, http.StatusUnauthorized, response.Failure[any](
			"Unauthorized", "unauthorized", c, "church.update.unauthorized", "", "warning",
		))
	}

	churchID, err := uuid.Parse(c.Params("churchID"))
	if err != nil {
		return response.JSON(c, http.StatusBadRequest, response.Failure[any](
			"Church ID must be a valid UUID", "invalid_church_id", c, "church.update.invalid_id", "", "warning",
		))
	}

	var request updateRequest
	if err := c.BodyParser(&request); err != nil || strings.TrimSpace(request.Name) == "" {
		return invalidChurchUpdate(c)
	}

	err = h.updater.UpdateByAuthUserID(c.UserContext(), authUserID, churchID, churchdomain.UpdateInput{
		Name: request.Name, Timezone: request.Timezone, Website: request.Website, Bio: request.Bio,
		City: request.City, StateOrProvince: request.StateOrProvince, CountryCode: request.CountryCode,
	})
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "church.update.user.not_provisioned", "", "warning",
		))
	}
	if errors.Is(err, application.ErrChurchUpdateForbidden) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"Global administrator access is required", "forbidden", c, "church.update.forbidden", "", "warning",
		))
	}
	if errors.Is(err, churchdomain.ErrInvalidChurch) {
		return invalidChurchUpdate(c)
	}
	if errors.Is(err, churchdomain.ErrChurchNotFound) {
		return response.JSON(c, http.StatusNotFound, response.Failure[any](
			"Church not found", "church_not_found", c, "church.update.not_found", "", "warning",
		))
	}
	if err != nil {
		log.Printf("church_update_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, http.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "church.update.failed", "", "error",
		))
	}

	return response.JSON(c, http.StatusOK, response.Success(updateResponse{ID: churchID.String()}, "Church updated", c, "church.updated", "", "info"))
}

type updateRequest struct {
	Name            string  `json:"name"`
	Timezone        *string `json:"timezone"`
	Website         *string `json:"website"`
	Bio             *string `json:"bio"`
	City            *string `json:"city"`
	StateOrProvince *string `json:"state_or_province"`
	CountryCode     *string `json:"country_code"`
}

type updateResponse struct {
	ID string `json:"id"`
}

func invalidChurchUpdate(c *fiber.Ctx) error {
	return response.JSON(c, http.StatusBadRequest, response.Failure[any](
		"Church name is required; website, time zone, and country code must be valid", "invalid_church", c, "church.update.invalid", "", "warning",
	))
}
