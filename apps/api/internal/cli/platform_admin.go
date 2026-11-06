package cli

import "fmt"

func FormatPlatformAdminSuccess(fullName, email string) string {
	if email != "" {
		return fmt.Sprintf("Platform admin for %s (%s) created successfully.", fullName, email)
	}
	return fmt.Sprintf("Platform admin for %s created successfully.", fullName)
}
