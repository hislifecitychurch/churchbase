package response

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func Failure[T any](message string, code string, c *fiber.Ctx, event, userID, status string) Envelope[T] {
	return FailureWithError[T](message, code, message, c, event, userID, status)
}

func FailureWithError[T any](message, code, errorMessage string, c *fiber.Ctx, event, userID, status string) Envelope[T] {
	return Envelope[T]{
		Success:  false,
		Message:  message,
		Errors:   []Error{{Code: code, Message: errorMessage}},
		Metadata: Metadata{RequestID: requestID(c), Timestamp: time.Now().UTC()},
		Log:      Log{Event: event, UserID: optionalString(userID), Status: status},
	}
}
