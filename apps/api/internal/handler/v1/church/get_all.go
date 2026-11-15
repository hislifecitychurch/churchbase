package church

import (
	"errors"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) GetAll(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, http.StatusUnauthorized, response.Failure[any](
			"Unauthorized", "unauthorized", c, "church.list.unauthorized", "", "warning",
		))
	}

	churches, err := h.directory.GetAllByAuthUserID(c.UserContext(), authUserID)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "church.list.user.not_provisioned", "", "warning",
		))
	}
	if errors.Is(err, application.ErrChurchDirectoryForbidden) {
		return response.JSON(c, http.StatusForbidden, response.Failure[any](
			"Global administrator or staff access is required", "forbidden", c, "church.list.forbidden", "", "warning",
		))
	}
	if err != nil {
		log.Printf("church_list_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, http.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "church.list.failed", "", "error",
		))
	}

	items := make([]getAllResponse, 0, len(churches))
	for _, item := range churches {
		items = append(items, getAllResponse{
			ID: item.ID.String(), Name: item.Name, Slug: item.Slug,
			Timezone: item.Timezone, Website: item.Website, Bio: item.Bio,
			City: item.City, StateOrProvince: item.StateOrProvince, CountryCode: item.CountryCode,
			ActiveMemberCount: item.ActiveMemberCount,
		})
	}
	return response.JSON(c, http.StatusOK, response.Success(items, "Churches retrieved", c, "churches.listed", "", "info"))
}

type getAllResponse struct {
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
