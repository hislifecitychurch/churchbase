package response

import "github.com/gofiber/fiber/v2"

func requestID(c *fiber.Ctx) *string {
	if value := c.Get(fiber.HeaderXRequestID); value != "" {
		return optionalString(value)
	}
	if value, ok := c.Locals("requestid").(string); ok {
		return optionalString(value)
	}
	return nil
}

func optionalString(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}

func JSON[T any](c *fiber.Ctx, status int, body Envelope[T]) error {
	return c.Status(status).JSON(body)
}
