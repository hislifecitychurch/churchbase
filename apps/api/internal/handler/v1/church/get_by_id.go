package church

import (
	"errors"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	churchdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/church"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) GetByID(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, http.StatusUnauthorized, response.Failure[any](
			"Unauthorized", "unauthorized", c, "church.get_by_id.unauthorized", "", "warning",
		))
	}

	churchID, err := uuid.Parse(c.Params("churchID"))
	if err != nil {
		return response.JSON(c, http.StatusBadRequest, response.Failure[any](
			"Church ID must be a valid UUID", "invalid_church_id", c, "church.get_by_id.invalid_id", "", "warning",
		))
	}

	church, err := h.directory.GetByIDByAuthUserID(c.UserContext(), authUserID, churchID)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "church.get_by_id.user.not_provisioned", "", "warning",
		))
	}
	if errors.Is(err, application.ErrChurchDirectoryForbidden) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"Global administrator or staff access is required", "forbidden", c, "church.get_by_id.forbidden", "", "warning",
		))
	}
	if errors.Is(err, churchdomain.ErrChurchNotFound) {
		return response.JSON(c, http.StatusNotFound, response.Failure[any](
			"Church not found", "church_not_found", c, "church.get_by_id.not_found", "", "warning",
		))
	}
	if err != nil {
		log.Printf("church_get_by_id_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, http.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "church.get_by_id.failed", "", "error",
		))
	}

	return response.JSON(c, http.StatusOK, response.Success(
		toChurchResponse(church), "Church retrieved", c, "church.retrieved", "", "info",
	))
}
