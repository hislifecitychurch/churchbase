package config_test

import (
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/config"
)

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
