package config_test

import (
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/config"
)

func TestLoadDefaultCORSOriginsIncludeLocalApplications(t *testing.T) {
	t.Setenv("PORT", "")
	t.Setenv("RL_DB_URL", "postgres://user:password@localhost:5432/churchbase")
	t.Setenv("KV_DB_URL", "redis://localhost:6379")
	t.Setenv("AUTH_BASE_URL", "http://localhost:36081")
	t.Setenv("ENVIRONMENT", "development")
	t.Setenv("CORS_ALLOWED_ORIGINS", "")

	settings, err := config.Load()
	if err != nil {
		t.Fatal(err)
	}
	want := "http://localhost:36000,http://localhost:36001,http://localhost:36002"
	if settings.AllowedOrigin != want {
		t.Fatalf("AllowedOrigin = %q, want %q", settings.AllowedOrigin, want)
	}
}

func TestLoadAuthBaseURLDoesNotRequireServiceToken(t *testing.T) {
	t.Setenv("AUTH_BASE_URL", "https://auth.example.org/")
	t.Setenv("AUTH_SERVICE_TOKEN", "")

	baseURL, err := config.LoadAuthBaseURL()
	if err != nil {
		t.Fatal(err)
	}
	if baseURL != "https://auth.example.org" {
		t.Fatalf("Auth base URL = %q, want https://auth.example.org", baseURL)
	}
}

func TestLoadAuthBaseURLRejectsPath(t *testing.T) {
	t.Setenv("AUTH_BASE_URL", "https://auth.example.org/auth")

	if _, err := config.LoadAuthBaseURL(); err == nil {
		t.Fatal("LoadAuthBaseURL succeeded with a path")
	}
}

func TestLoadAuthServiceConfig(t *testing.T) {
	t.Setenv("AUTH_BASE_URL", "https://auth.example.org/")
	t.Setenv("AUTH_SERVICE_TOKEN", "01234567890123456789012345678901")
	settings, err := config.LoadAuthServiceConfig()
	if err != nil {
		t.Fatal(err)
	}
	if settings.BaseURL != "https://auth.example.org" {
		t.Fatalf("Auth base URL = %q, want https://auth.example.org", settings.BaseURL)
	}
}

func TestLoadAuthServiceConfigRejectsInsecureNonDevelopmentURL(t *testing.T) {
	t.Setenv("AUTH_BASE_URL", "http://auth.example.org")
	t.Setenv("AUTH_SERVICE_TOKEN", "01234567890123456789012345678901")
	t.Setenv("ENVIRONMENT", "production")

	if _, err := config.LoadAuthServiceConfig(); err == nil {
		t.Fatal("LoadAuthServiceConfig succeeded with HTTP outside development")
	}
}

func TestLoadAuthServiceConfigRejectsShortToken(t *testing.T) {
	t.Setenv("AUTH_BASE_URL", "https://auth.example.org")
	t.Setenv("AUTH_SERVICE_TOKEN", "too-short")

	if _, err := config.LoadAuthServiceConfig(); err == nil {
		t.Fatal("LoadAuthServiceConfig succeeded with a short token")
	}
}
