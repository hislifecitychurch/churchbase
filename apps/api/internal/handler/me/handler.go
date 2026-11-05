package me

import (
	"context"
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/application"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

type CurrentUserService interface {
	GetByAuthUserID(context.Context, string) (application.CurrentUser, error)
}

type Handler struct {
	currentUsers CurrentUserService
}

func NewHandler(currentUsers CurrentUserService) *Handler {
	return &Handler{currentUsers: currentUsers}
}

func (h *Handler) Get(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, fiber.StatusUnauthorized, response.FailureWithError[any](
			"Unauthorized", "unauthorized", "Authentication is required", c, "me.unauthorized", "", "warning",
		))
	}

	current, err := h.currentUsers.GetByAuthUserID(c.UserContext(), authUserID)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, fiber.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "me.user.not_provisioned", "", "warning",
		))
	}
	if err != nil {
		log.Printf("current_user_lookup_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, fiber.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "me.lookup.failed", "", "error",
		))
	}

	return response.JSON(c, fiber.StatusOK, response.Success(currentUserResponse{
		ID:           current.User.ID,
		PlatformRole: current.User.PlatformRole,
		Profile: profileResponse{
			FirstName: current.Profile.FirstName,
			LastName:  current.Profile.LastName,
		},
	}, "Current user retrieved", c, "me.retrieved", current.User.ID.String(), "info"))
}

type currentUserResponse struct {
	ID           uuid.UUID                `json:"id"`
	PlatformRole *userdomain.PlatformRole `json:"platform_role"`
	Profile      profileResponse          `json:"profile"`
}

type profileResponse struct {
	FirstName *string `json:"first_name"`
	LastName  *string `json:"last_name"`
}
