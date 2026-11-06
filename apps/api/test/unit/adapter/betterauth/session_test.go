package betterauth_test

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	betterauthadapter "github.com/hislifecitychurch/churchbase/apps/api/internal/adapter/betterauth"
)

func TestSessionClientValidateForwardsOnlySessionCredentials(t *testing.T) {
	const cookie = "churchbase.session_token=session-secret"
	const authorization = "Bearer access-token"
	server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet || request.URL.Path != "/api/v1/auth/get-session" || request.URL.Query().Get("disableRefresh") != "true" {
			t.Errorf("request URI = %s, want get-session with disableRefresh=true", request.URL.RequestURI())
		}
		if request.Header.Get("Cookie") != cookie || request.Header.Get("Authorization") != authorization {
			t.Errorf("forwarded credentials = %q / %q", request.Header.Get("Cookie"), request.Header.Get("Authorization"))
		}
		if request.Header.Get("X-Auth-Service-Token") != "" {
			t.Error("session validation sent an internal service token")
		}
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte(`{"session":{"userId":"auth-user-1"},"user":{"id":"auth-user-1"}}`))
	}))
	defer server.Close()

	id, valid, err := betterauthadapter.NewSessionClient(server.URL).Validate(context.Background(), cookie, authorization)
	if err != nil || !valid || id != "auth-user-1" {
		t.Fatalf("result = %q, %v, %v", id, valid, err)
	}
}

func TestSessionClientValidateWithoutCredentialsSkipsAuthRequest(t *testing.T) {
	called := false
	server := httptest.NewServer(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { called = true }))
	defer server.Close()

	id, valid, err := betterauthadapter.NewSessionClient(server.URL).Validate(context.Background(), " ", "")
	if err != nil || valid || id != "" || called {
		t.Fatalf("result = %q, %v, %v; called = %v", id, valid, err, called)
	}
}

func TestSessionClientValidateClassifiesInvalidSession(t *testing.T) {
	tests := []struct {
		name   string
		status int
		body   string
	}{
		{name: "unauthorized", status: http.StatusUnauthorized},
		{name: "forbidden", status: http.StatusForbidden},
		{name: "empty session", status: http.StatusOK, body: `{"session":null,"user":null}`},
		{name: "mismatched identity", status: http.StatusOK, body: `{"session":{"userId":"auth-user-1"},"user":{"id":"auth-user-2"}}`},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
				writer.WriteHeader(test.status)
				_, _ = writer.Write([]byte(test.body))
			}))
			defer server.Close()

			id, valid, err := betterauthadapter.NewSessionClient(server.URL).Validate(context.Background(), "session=present", "")
			if err != nil || valid || id != "" {
				t.Fatalf("result = %q, %v, %v", id, valid, err)
			}
		})
	}
}

func TestSessionClientValidateClassifiesAuthFailuresAsUnavailable(t *testing.T) {
	tests := []struct {
		name   string
		status int
		body   string
	}{
		{name: "upstream failure", status: http.StatusBadGateway},
		{name: "malformed response", status: http.StatusOK, body: "not json"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(writer http.ResponseWriter, _ *http.Request) {
				writer.WriteHeader(test.status)
				_, _ = writer.Write([]byte(test.body))
			}))
			defer server.Close()

			id, valid, err := betterauthadapter.NewSessionClient(server.URL).Validate(context.Background(), "session=present", "")
			if id != "" || valid || !errors.Is(err, betterauthadapter.ErrUnavailable) {
				t.Fatalf("result = %q, %v, %v; want unavailable", id, valid, err)
			}
		})
	}
}
