package response

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func Success[T any](data T, message string, c *fiber.Ctx, event, userID, status string) Envelope[T] {
	return Envelope[T]{
		Success:  true,
		Message:  message,
		Data:     data,
		Errors:   []Error{},
		Metadata: Metadata{RequestID: requestID(c), Timestamp: time.Now().UTC()},
		Log:      Log{Event: event, UserID: optionalString(userID), Status: status},
	}
}
