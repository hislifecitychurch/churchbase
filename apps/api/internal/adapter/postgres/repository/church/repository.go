package church

import entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"

type ChurchRepository struct {
	client *entclient.Client
}

func NewChurchRepository(client *entclient.Client) *ChurchRepository {
	return &ChurchRepository{client: client}
}
