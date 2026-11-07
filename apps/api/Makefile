SHELL := /bin/sh

ATLAS ?= atlas
ATLAS_DIR := file://ent/migrate/migrations

.PHONY: help dev cli/user/platform format generate atlas/validate atlas/hash atlas/new atlas/apply build test lint tidy clean

help:
	@printf "%s\n" \
		"make dev            Generate Ent code and start the API on port 36080" \
		"make cli/user/platform ARGS=... Generate Ent code; prompt/create/link a platform admin" \
		"make generate       Generate the Ent client" \
		"make atlas/validate Validate Atlas migration checksums and SQL" \
		"make atlas/hash     Recompute Atlas migration checksums" \
		"make atlas/new name=... Create an empty Atlas migration" \
		"make atlas/apply    Apply Atlas migrations using RL_DB_URL" \
		"make build          Generate Ent code and compile the API" \
		"make test           Run Go tests" \
		"make lint           Run gofmt and go vet" \
		"make tidy           Sync Go module files"

dev: generate
	@set -a; [ ! -f .env ] || . ./.env; set +a; go run ./cmd/api

cli/user/platform: generate
	@set -a; [ ! -f .env ] || . ./.env; set +a; go run ./cmd/cli/user/platform $(ARGS)

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
	@set -a; [ ! -f .env ] || . ./.env; set +a; test -n "$$RL_DB_URL" || (echo "RL_DB_URL is required"; exit 1); $(ATLAS) migrate apply --dir $(ATLAS_DIR) --url "$$RL_DB_URL"

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
