package cli

import "fmt"

func FormatGlobalAdminSuccess(fullName, email string) string {
	if email != "" {
		return fmt.Sprintf("Global admin for %s (%s) created successfully.", fullName, email)
	}
	return fmt.Sprintf("Global admin for %s created successfully.", fullName)
}
