package cli_test

import (
	"strings"
	"testing"

	"github.com/hislifecitychurch/churchbase/apps/api/internal/cli"
)

func TestReadPasswordConfirmation(t *testing.T) {
	password, confirmation, err := cli.ReadPasswordConfirmation(strings.NewReader("secret-password\nsecret-password\n"))
	if err != nil {
		t.Fatal(err)
	}
	if password != "secret-password" || confirmation != password {
		t.Fatalf("password confirmation = %q / %q", password, confirmation)
	}
}

func TestReadPasswordConfirmationRejectsMalformedInput(t *testing.T) {
	tests := []struct {
		name  string
		input string
	}{
		{name: "missing confirmation", input: "secret-password\n"},
		{name: "extra line", input: "secret-password\nsecret-password\nextra\n"},
		{name: "empty password", input: "\nsecret-password\n"},
		{name: "oversized", input: strings.Repeat("x", 4097)},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if _, _, err := cli.ReadPasswordConfirmation(strings.NewReader(test.input)); err == nil {
				t.Fatal("ReadPasswordConfirmation succeeded for malformed input")
			}
		})
	}
}
