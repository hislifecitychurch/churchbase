package betterauth

import (
	"net/http"
	"strings"
	"time"
)

type Client struct {
	baseURL      string
	serviceToken string
	httpClient   *http.Client
}

func NewClient(baseURL, serviceToken string) *Client {
	return &Client{
		baseURL:      strings.TrimSuffix(baseURL, "/"),
		serviceToken: serviceToken,
		httpClient: &http.Client{
			Timeout: 15 * time.Second,
			CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
	}
}
