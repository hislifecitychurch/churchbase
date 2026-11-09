package user

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	accesscontext "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/access_context"
	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/actor"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/shared/response"
)

func (h *Handler) GetAccessContexts(c *fiber.Ctx) error {
	authUserID, ok := actor.ID(c.UserContext())
	if !ok {
		return response.JSON(c, fiber.StatusUnauthorized, response.FailureWithError[any](
			"Unauthorized", "unauthorized", "Authentication is required", c, "me.access_contexts.unauthorized", "", "warning",
		))
	}

	contexts, err := h.accessContexts.ListByAuthUserID(c.UserContext(), authUserID)
	if errors.Is(err, userdomain.ErrUserNotFound) {
		return response.JSON(c, fiber.StatusForbidden, response.Failure[any](
			"User has not been provisioned for Churchbase", "user_not_provisioned", c, "me.access_contexts.user.not_provisioned", "", "warning",
		))
	}
	if err != nil {
		log.Printf("access_context_lookup_failed request_id=%q error=%v", c.GetRespHeader("X-Request-ID"), err)
		return response.JSON(c, fiber.StatusInternalServerError, response.Failure[any](
			"An internal error occurred", "internal_error", c, "me.access_contexts.lookup.failed", "", "error",
		))
	}

	items := make([]accessContextResponse, 0, len(contexts))
	for _, item := range contexts {
		items = append(items, accessContextResponse{
			ID:           item.ID,
			ChurchID:     item.ChurchID,
			Kind:         item.Kind,
			Slug:         item.Slug,
			Name:         item.Name,
			ChurchName:   item.ChurchName,
			Role:         item.Role,
			Capabilities: item.Capabilities,
		})
	}
	return response.JSON(c, fiber.StatusOK, response.Success(accessContextsResponse{Contexts: items}, "Access contexts retrieved", c, "me.access_contexts.retrieved", "", "info"))
}

type accessContextsResponse struct {
	Contexts []accessContextResponse `json:"contexts"`
}

type accessContextResponse struct {
	ID           uuid.UUID          `json:"id"`
	ChurchID     uuid.UUID          `json:"church_id"`
	Kind         accesscontext.Kind `json:"kind"`
	Slug         string             `json:"slug"`
	Name         string             `json:"name"`
	ChurchName   string             `json:"church_name"`
	Role         string             `json:"role"`
	Capabilities []string           `json:"capabilities"`
}
