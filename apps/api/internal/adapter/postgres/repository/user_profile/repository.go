package userprofile

import entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"

type UserProfileRepository struct {
	client *entclient.Client
}

func NewUserProfileRepository(client *entclient.Client) *UserProfileRepository {
	return &UserProfileRepository{client: client}
}
