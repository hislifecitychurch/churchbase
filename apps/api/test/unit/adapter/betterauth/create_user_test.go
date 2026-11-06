package betterauth_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	betterauthadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/betterauth"
)

func TestClientCreateUser(t *testing.T) {
	const token = "01234567890123456789012345678901"
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodPost || request.URL.Path != "/internal/provision-user" {
			t.Errorf("request = %s %s, want POST /internal/provision-user", request.Method, request.URL.Path)
		}
		if request.Header.Get("Authorization") != "Bearer "+token {
			t.Error("Auth service token was not sent as a bearer token")
		}
		var body struct {
			Email    string `json:"email"`
			Name     string `json:"name"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
			t.Error(err)
		}
		if body.Email != "admin@example.org" || body.Name != "Ada Lovelace" || body.Password != "strong-password" {
			t.Errorf("request body = %+v", body)
		}

		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusCreated)
		_, _ = writer.Write([]byte(`{"authUserId":"auth-user-1"}`))
	}))
	defer server.Close()

	client := betterauthadapter.NewClient(server.URL, token)
	id, err := client.CreateUser(context.Background(), "admin@example.org", "Ada Lovelace", "strong-password")
	if err != nil {
		t.Fatal(err)
	}
	if id != "auth-user-1" {
		t.Fatalf("Auth user ID = %q, want auth-user-1", id)
	}
}

func TestClientCreateUserUsesSafeFailureMessages(t *testing.T) {
	tests := []struct {
		status  int
		message string
	}{
		{status: http.StatusBadRequest, message: "check the Auth password requirements"},
		{status: http.StatusUnauthorized, message: "check the shared AUTH_SERVICE_TOKEN"},
		{status: http.StatusConflict, message: "link the existing Auth user ID"},
		{status: http.StatusServiceUnavailable, message: "check AUTH_SERVICE_TOKEN in apps/auth"},
	}

	for _, test := range tests {
		t.Run(http.StatusText(test.status), func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
				writer.WriteHeader(test.status)
				_, _ = writer.Write([]byte("sensitive service detail"))
			}))
			defer server.Close()

			client := betterauthadapter.NewClient(server.URL, strings.Repeat("x", 32))
			_, err := client.CreateUser(context.Background(), "", "", "")
			if err == nil || !strings.Contains(err.Error(), test.message) || strings.Contains(err.Error(), "sensitive service detail") {
				t.Fatalf("CreateUser error = %v, want safe message containing %q", err, test.message)
			}
		})
	}
}
