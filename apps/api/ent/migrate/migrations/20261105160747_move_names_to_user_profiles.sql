DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "users"
        WHERE NOT EXISTS (
            SELECT 1
            FROM "user_profiles"
            WHERE "user_profiles"."user_id" = "users"."id"
        )
    ) THEN
        RAISE EXCEPTION 'cannot move user names: one or more users lack a profile';
    END IF;
END;
$$;

ALTER TABLE "user_profiles"
    ADD COLUMN "first_name" character varying NULL,
    ADD COLUMN "last_name" character varying NULL,
    ADD CONSTRAINT "user_profiles_first_name_check"
        CHECK ("first_name" IS NULL OR length(trim("first_name")) > 0),
    ADD CONSTRAINT "user_profiles_last_name_check"
        CHECK ("last_name" IS NULL OR length(trim("last_name")) > 0);

UPDATE "user_profiles" AS "profiles"
SET "first_name" = "users"."first_name",
    "last_name" = "users"."last_name"
FROM "users"
WHERE "profiles"."user_id" = "users"."id";

ALTER TABLE "users"
    DROP CONSTRAINT "users_first_name_check",
    DROP CONSTRAINT "users_last_name_check",
    DROP COLUMN "first_name",
    DROP COLUMN "last_name";
