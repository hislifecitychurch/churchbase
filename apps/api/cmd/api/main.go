package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/app"
	"github.com/hislifecitychurch/churchbase/apps/api/internal/config"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("load API configuration", "error", err)
		os.Exit(1)
	}

	application, err := app.New(cfg)
	if err != nil {
		slog.Error("initialize API", "error", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if err := application.Run(ctx); err != nil && !errors.Is(err, context.Canceled) {
		slog.Error("run API", "error", err)
		os.Exit(1)
	}
}
