package access_context

import entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"

type AccessContextRepository struct {
	client *entclient.Client
}

func NewAccessContextRepository(client *entclient.Client) *AccessContextRepository {
	return &AccessContextRepository{client: client}
}
