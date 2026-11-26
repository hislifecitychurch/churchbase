ALTER TABLE "users"
    ADD COLUMN "platform_role" character varying NULL,
    ADD CONSTRAINT "users_platform_role_check"
        CHECK ("platform_role" IS NULL OR "platform_role" IN ('admin', 'staff')),
    ADD CONSTRAINT "users_platform_role_auth_user_id_check"
        CHECK ("platform_role" IS NULL OR "auth_user_id" IS NOT NULL);
