SHELL := /bin/sh

ATLAS ?= atlas
ATLAS_DIR := file://ent/migrate/migrations

.PHONY: help infra infra-down dev format generate atlas/validate atlas/hash atlas/new atlas/apply build test lint tidy clean

help:
	@printf "%s\n" \
		"make infra          Start local PostgreSQL and Redis" \
		"make infra-down     Stop local PostgreSQL and Redis" \
		"make dev            Start the API on port 36080" \
		"make generate       Generate the Ent client" \
		"make atlas/validate Validate Atlas migration checksums and SQL" \
		"make atlas/hash     Recompute Atlas migration checksums" \
		"make atlas/new name=... Create an empty Atlas migration" \
		"make atlas/apply    Apply Atlas migrations using DATABASE_URL" \
		"make build          Generate Ent code and compile the API" \
		"make test           Run Go tests" \
		"make lint           Run gofmt and go vet" \
		"make tidy           Sync Go module files"

infra:
	docker compose up -d --wait --wait-timeout 60 postgres redis

infra-down:
	docker compose down

dev:
	@set -a; [ ! -f .env ] || . ./.env; set +a; go run ./cmd/api

format:
	gofmt -w $$(find . -type f -name '*.go')

generate:
	go generate ./ent

atlas/validate:
	$(ATLAS) migrate validate --dir $(ATLAS_DIR)

atlas/hash:
	$(ATLAS) migrate hash --dir $(ATLAS_DIR)

atlas/new:
	@test -n "$(name)" || (echo "usage: make atlas/new name=..."; exit 1)
	$(ATLAS) migrate new --dir $(ATLAS_DIR) "$(name)"

atlas/apply:
	@set -a; [ ! -f .env ] || . ./.env; set +a; test -n "$$DATABASE_URL" || (echo "DATABASE_URL is required"; exit 1); $(ATLAS) migrate apply --dir $(ATLAS_DIR) --url "$$DATABASE_URL"

build: generate
	mkdir -p bin
	go build -o ./bin/churchbase-api ./cmd/api

test: generate
	go test ./...

lint: generate
	@test -z "$$(gofmt -l .)" || (echo "gofmt required:"; gofmt -l .; exit 1)
	go vet ./...

tidy:
	go mod tidy

clean:
	rm -rf ./bin
