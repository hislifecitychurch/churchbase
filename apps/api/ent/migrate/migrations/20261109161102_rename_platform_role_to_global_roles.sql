ALTER TABLE "users"
    RENAME COLUMN "platform_role" TO "global_roles";

ALTER TABLE "users"
    RENAME CONSTRAINT "users_platform_role_check" TO "users_global_roles_check";

ALTER TABLE "users"
    RENAME CONSTRAINT "users_platform_role_auth_user_id_check" TO "users_global_roles_auth_user_id_check";
