package cli

import (
	"bytes"
	"fmt"
	"io"
	"strings"
)

func ReadPasswordConfirmation(reader io.Reader) (string, string, error) {
	passwordBytes, err := io.ReadAll(io.LimitReader(reader, 4097))
	if err != nil {
		return "", "", fmt.Errorf("read password input: %w", err)
	}
	defer clear(passwordBytes)
	if len(passwordBytes) > 4096 {
		return "", "", fmt.Errorf("password input is too large")
	}

	passwordBytes = bytes.TrimSuffix(passwordBytes, []byte("\n"))
	lines := bytes.Split(passwordBytes, []byte("\n"))
	if len(lines) != 2 {
		return "", "", fmt.Errorf("provide the password and confirmation on two separate lines")
	}
	password := strings.TrimSuffix(string(lines[0]), "\r")
	confirmation := strings.TrimSuffix(string(lines[1]), "\r")
	if password == "" || confirmation == "" {
		return "", "", fmt.Errorf("password and confirmation must not be empty")
	}
	return password, confirmation, nil
}
