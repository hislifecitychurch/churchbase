-- Do not guess first/last-name boundaries for existing full display names.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "users" WHERE "display_name" IS NOT NULL) THEN
        RAISE EXCEPTION 'users.display_name contains data; split names manually before applying this migration';
    END IF;
END;
$$;

ALTER TABLE "users"
    DROP CONSTRAINT "users_display_name_check",
    DROP COLUMN "display_name",
    ADD COLUMN "first_name" character varying NULL,
    ADD COLUMN "last_name" character varying NULL,
    ADD CONSTRAINT "users_first_name_check"
        CHECK ("first_name" IS NULL OR length(trim("first_name")) > 0),
    ADD CONSTRAINT "users_last_name_check"
        CHECK ("last_name" IS NULL OR length(trim("last_name")) > 0);
