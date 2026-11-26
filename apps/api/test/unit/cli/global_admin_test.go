package cli_test

import (
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/cli"
)

func TestFormatGlobalAdminSuccess(t *testing.T) {
	tests := []struct {
		name, fullName, email, want string
	}{
		{
			name:     "with email",
			fullName: "Ada Lovelace",
			email:    "ada@example.org",
			want:     "Global admin for Ada Lovelace (ada@example.org) created successfully.",
		},
		{
			name:     "linked identity without email",
			fullName: "Ada Lovelace",
			want:     "Global admin for Ada Lovelace created successfully.",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := cli.FormatGlobalAdminSuccess(test.fullName, test.email); got != test.want {
				t.Fatalf("FormatGlobalAdminSuccess() = %q, want %q", got, test.want)
			}
		})
	}
}
