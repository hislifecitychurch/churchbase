CREATE FUNCTION "churchbase_uuidv7"() RETURNS uuid
LANGUAGE plpgsql VOLATILE AS $$
DECLARE
    unix_ts_ms bigint := floor(extract(epoch FROM clock_timestamp()) * 1000);
    random_bytes bytea := substring(uuid_send(gen_random_uuid()) FROM 1 FOR 10);
BEGIN
    RETURN encode(
        substring(int8send(unix_ts_ms) FROM 3 FOR 6)
        || set_byte(
            set_byte(random_bytes, 0, (get_byte(random_bytes, 0) & 15) | 112),
            2,
            (get_byte(random_bytes, 2) & 63) | 128
        ),
        'hex'
    )::uuid;
END;
$$;

CREATE TABLE "users" (
    "id" uuid NOT NULL,
    "display_name" character varying NULL,
    "auth_user_id" character varying NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "created_by" character varying NULL,
    "updated_by" character varying NULL,
    "deleted_at" timestamptz NULL,
    "deleted_by" character varying NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "users_display_name_check"
        CHECK ("display_name" IS NULL OR length(trim("display_name")) > 0),
    CONSTRAINT "users_auth_user_id_check"
        CHECK ("auth_user_id" IS NULL OR length(trim("auth_user_id")) > 0)
);

CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users" ("auth_user_id");

CREATE TABLE "user_profiles" (
    "id" uuid NOT NULL,
    "bio" character varying NULL,
    "phone_number" character varying NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "created_by" character varying NULL,
    "updated_by" character varying NULL,
    "deleted_at" timestamptz NULL,
    "deleted_by" character varying NULL,
    "user_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "user_profiles_users_profile"
        FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles" ("user_id");

INSERT INTO "users" ("id", "auth_user_id")
SELECT "churchbase_uuidv7"(), "auth_user_id"
FROM (
    SELECT DISTINCT "auth_user_id" FROM "church_memberships"
) AS "existing_members";

ALTER TABLE "church_memberships" ADD COLUMN "user_id" uuid NULL;

UPDATE "church_memberships" AS "memberships"
SET "user_id" = "users"."id"
FROM "users"
WHERE "users"."auth_user_id" = "memberships"."auth_user_id";

ALTER TABLE "church_memberships"
    DROP CONSTRAINT "church_memberships_auth_user_id_check",
    ALTER COLUMN "user_id" SET NOT NULL,
    ADD CONSTRAINT "church_memberships_users_church_memberships"
        FOREIGN KEY ("user_id") REFERENCES "users" ("id");

DROP INDEX "church_memberships_church_user_key";
DROP INDEX "churchmembership_auth_user_id";

ALTER TABLE "church_memberships" DROP COLUMN "auth_user_id";

CREATE UNIQUE INDEX "church_memberships_church_user_key"
    ON "church_memberships" ("church_id", "user_id");
CREATE INDEX "churchmembership_user_id"
    ON "church_memberships" ("user_id");

DROP FUNCTION "churchbase_uuidv7"();
