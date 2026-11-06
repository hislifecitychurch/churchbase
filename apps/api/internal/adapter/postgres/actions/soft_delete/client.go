package soft_delete

import entclient "github.com/hislifecitychurch/churchbase/apps/api/ent"

func ConfigureClient(client *entclient.Client) {
	client.Use(softDeleteHook)
	client.Intercept(entclient.InterceptFunc(softDeleteInterceptor))
}
