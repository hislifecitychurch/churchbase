package betterauth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const sessionPath = "/api/v1/auth/get-session?disableRefresh=true"

var ErrUnavailable = errors.New("authentication service unavailable")

type SessionClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewSessionClient(baseURL string) *SessionClient {
	return &SessionClient{
		baseURL: strings.TrimSuffix(baseURL, "/"),
		httpClient: &http.Client{
			Timeout: 3 * time.Second,
			CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
	}
}

func (c *SessionClient) Validate(ctx context.Context, cookie, authorization string) (string, bool, error) {
	if strings.TrimSpace(cookie) == "" && strings.TrimSpace(authorization) == "" {
		return "", false, nil
	}
	if c == nil || c.baseURL == "" {
		return "", false, ErrUnavailable
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+sessionPath, nil)
	if err != nil {
		return "", false, fmt.Errorf("%w: create request", ErrUnavailable)
	}
	if cookie != "" {
		request.Header.Set("Cookie", cookie)
	}
	if authorization != "" {
		request.Header.Set("Authorization", authorization)
	}

	response, err := c.httpClient.Do(request)
	if err != nil {
		return "", false, fmt.Errorf("%w: request failed: %v", ErrUnavailable, err)
	}
	defer response.Body.Close()

	if response.StatusCode == http.StatusUnauthorized || response.StatusCode == http.StatusForbidden {
		return "", false, nil
	}
	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return "", false, fmt.Errorf("%w: status %d", ErrUnavailable, response.StatusCode)
	}

	var payload struct {
		Session *struct {
			UserID string `json:"userId"`
		} `json:"session"`
		User *struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	if err := json.NewDecoder(io.LimitReader(response.Body, 1<<20)).Decode(&payload); err != nil {
		return "", false, fmt.Errorf("%w: invalid session response", ErrUnavailable)
	}
	if payload.Session == nil || payload.User == nil || strings.TrimSpace(payload.Session.UserID) == "" || strings.TrimSpace(payload.User.ID) == "" || payload.Session.UserID != payload.User.ID {
		return "", false, nil
	}

	return payload.User.ID, true, nil
}
