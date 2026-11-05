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
		return c.Status(fiber.StatusUnauthorized).JSON(errorResponse{
			Error:   "unauthorized",
			Message: "Authentication is required",
		})
	}

	current, err := h.currentUsers.GetByAuthUserID(c.UserContext(), authUserID)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return c.Status(fiber.StatusForbidden).JSON(errorResponse{
			Error:   "user_not_provisioned",
			Message: "User has not been provisioned for Churchbase",
		})
	}
	if err != nil {
		log.Printf("current_user_lookup_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return c.Status(fiber.StatusInternalServerError).JSON(errorResponse{
			Error:   "internal_error",
			Message: "An internal error occurred",
		})
	}

	return c.JSON(currentUserResponse{
		ID:           current.User.ID,
		PlatformRole: current.User.PlatformRole,
		Profile: profileResponse{
			FirstName: current.Profile.FirstName,
			LastName:  current.Profile.LastName,
		},
	})
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

type errorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}
