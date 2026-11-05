package user

import entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"

type UserRepository struct {
	client *entclient.Client
}

func NewUserRepository(client *entclient.Client) *UserRepository {
	return &UserRepository{client: client}
}
