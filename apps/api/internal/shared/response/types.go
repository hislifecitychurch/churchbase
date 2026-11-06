package response

import "time"

type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type Pagination struct {
	Page    int  `json:"page"`
	Items   int  `json:"items"`
	Total   int  `json:"total"`
	Pages   int  `json:"pages"`
	Limit   int  `json:"limit"`
	HasNext bool `json:"has_next"`
	HasPrev bool `json:"has_prev"`
}

type Metadata struct {
	RequestID *string   `json:"request_id"`
	Timestamp time.Time `json:"timestamp"`
}

type Log struct {
	Event  string  `json:"event"`
	UserID *string `json:"user_id"`
	Status string  `json:"status"`
}

type Envelope[T any] struct {
	Success    bool        `json:"success"`
	Message    string      `json:"message"`
	Data       T           `json:"data"`
	Filters    any         `json:"filters"`
	Errors     []Error     `json:"errors"`
	Pagination *Pagination `json:"pagination"`
	Metadata   Metadata    `json:"metadata"`
	Log        Log         `json:"log"`
}
