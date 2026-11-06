package service

import (
	"context"
	"fmt"

	userdomain "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user"
	userprofile "github.com/hislifecitychurch/churchbase/apps/api/internal/domain/user_profile"
)

type ProfileCreator interface {
	Create(ctx context.Context, input userprofile.CreateInput) (userprofile.Profile, error)
}

type TransactionRunner interface {
	WithinTransaction(ctx context.Context, run func(context.Context) error) error
}

type Service struct {
	repository   userdomain.Repository
	profiles     ProfileCreator
	transactions TransactionRunner
}

func NewService(repository userdomain.Repository, profiles ProfileCreator, transactions TransactionRunner) *Service {
	return &Service{repository: repository, profiles: profiles, transactions: transactions}
}

func (s *Service) createWithProfile(
	ctx context.Context,
	input userdomain.CreateInput,
	profileDetails userprofile.Details,
	createUser func(context.Context, userdomain.CreateInput) (userdomain.User, error),
) (userdomain.User, error) {
	var created userdomain.User
	err := s.transactions.WithinTransaction(ctx, func(txCtx context.Context) error {
		var err error
		created, err = createUser(txCtx, input)
		if err != nil {
			return err
		}
		if _, err := s.profiles.Create(txCtx, userprofile.CreateInput{
			UserID:  created.ID,
			Details: profileDetails,
		}); err != nil {
			return fmt.Errorf("create profile for API user: %w", err)
		}
		return nil
	})
	if err != nil {
		return userdomain.User{}, fmt.Errorf("create API user and profile: %w", err)
	}
	return created, nil
}
