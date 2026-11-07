package workspaceaccessevent

import entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"

type WorkspaceAccessEventRepository struct {
	client *entclient.Client
}

func NewWorkspaceAccessEventRepository(client *entclient.Client) *WorkspaceAccessEventRepository {
	return &WorkspaceAccessEventRepository{client: client}
}
