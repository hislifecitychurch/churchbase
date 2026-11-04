package config

import (
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port          int
	DatabaseURL   string
	RedisURL      string
	AllowedOrigin string
}

func Load() (Config, error) {
	port := 34080
	if value := strings.TrimSpace(os.Getenv("PORT")); value != "" {
		parsed, err := strconv.Atoi(value)
		if err != nil || parsed < 1 || parsed > 65535 {
			return Config{}, fmt.Errorf("PORT must be an integer between 1 and 65535")
		}
		port = parsed
	}

	databaseURL, err := endpoint("DATABASE_URL", "postgres", "postgresql")
	if err != nil {
		return Config{}, err
	}
	redisURL, err := endpoint("REDIS_URL", "redis", "rediss")
	if err != nil {
		return Config{}, err
	}

	origin := strings.TrimSpace(os.Getenv("CORS_ALLOWED_ORIGINS"))
	if origin == "" {
		origin = "http://localhost:36002"
	}
	origins := strings.Split(origin, ",")
	for i, candidate := range origins {
		candidate = strings.TrimSpace(candidate)
		parsed, err := url.Parse(candidate)
		if err != nil || parsed.Host == "" || parsed.User != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || (parsed.Path != "" && parsed.Path != "/") || parsed.RawQuery != "" || parsed.Fragment != "" {
			return Config{}, fmt.Errorf("CORS_ALLOWED_ORIGINS must contain comma-separated HTTP origins")
		}
		origins[i] = parsed.Scheme + "://" + parsed.Host
	}

	return Config{Port: port, DatabaseURL: databaseURL, RedisURL: redisURL, AllowedOrigin: strings.Join(origins, ",")}, nil
}

func endpoint(name string, schemes ...string) (string, error) {
	value := strings.TrimSpace(os.Getenv(name))
	if value == "" {
		return "", fmt.Errorf("%s is required", name)
	}
	parsed, err := url.Parse(value)
	if err != nil || parsed.Host == "" {
		return "", fmt.Errorf("%s must be a valid URL with a host", name)
	}
	for _, scheme := range schemes {
		if parsed.Scheme == scheme {
			return value, nil
		}
	}
	return "", fmt.Errorf("%s must use %s", name, strings.Join(schemes, " or "))
}
