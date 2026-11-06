package betterauth

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func (c *Client) CreateUser(ctx context.Context, email, name, password string) (string, error) {
	body, err := json.Marshal(struct {
		Email    string `json:"email"`
		Name     string `json:"name"`
		Password string `json:"password"`
	}{Email: email, Name: name, Password: password})
	if err != nil {
		return "", fmt.Errorf("encode Auth user request: %w", err)
	}
	defer func() {
		for i := range body {
			body[i] = 0
		}
	}()

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/internal/provision-user", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("create Auth user request: %w", err)
	}
	request.Header.Set("Authorization", "Bearer "+c.serviceToken)
	request.Header.Set("Content-Type", "application/json")

	response, err := c.httpClient.Do(request)
	if err != nil {
		return "", fmt.Errorf("call Auth user provisioning: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusCreated {
		switch response.StatusCode {
		case http.StatusBadRequest:
			return "", errors.New("Auth rejected the email or password; check the Auth password requirements")
		case http.StatusUnauthorized:
			return "", errors.New("Auth provisioning was unauthorized; check the shared AUTH_SERVICE_TOKEN")
		case http.StatusConflict:
			return "", errors.New("Auth identity already exists; link the existing Auth user ID instead")
		case http.StatusServiceUnavailable:
			return "", errors.New("Auth provisioning is not configured; check AUTH_SERVICE_TOKEN in apps/auth")
		default:
			return "", fmt.Errorf("Auth user provisioning failed with status %d", response.StatusCode)
		}
	}

	var result struct {
		AuthUserID string `json:"authUserId"`
	}
	if err := json.NewDecoder(io.LimitReader(response.Body, 1<<20)).Decode(&result); err != nil {
		return "", fmt.Errorf("decode Auth user response: %w", err)
	}
	if result.AuthUserID == "" {
		return "", fmt.Errorf("Auth user response did not include an ID")
	}

	return result.AuthUserID, nil
}
