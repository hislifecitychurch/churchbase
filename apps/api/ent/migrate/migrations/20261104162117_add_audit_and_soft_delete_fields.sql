ALTER TABLE "churches"
    ADD COLUMN "created_by" character varying NULL,
    ADD COLUMN "updated_by" character varying NULL,
    ADD COLUMN "deleted_at" timestamptz NULL,
    ADD COLUMN "deleted_by" character varying NULL;

ALTER TABLE "church_memberships"
    ADD COLUMN "created_by" character varying NULL,
    ADD COLUMN "updated_by" character varying NULL,
    ADD COLUMN "deleted_at" timestamptz NULL,
    ADD COLUMN "deleted_by" character varying NULL;

ALTER TABLE "ministries"
    ADD COLUMN "created_by" character varying NULL,
    ADD COLUMN "updated_by" character varying NULL,
    ADD COLUMN "deleted_at" timestamptz NULL,
    ADD COLUMN "deleted_by" character varying NULL;

ALTER TABLE "ministry_memberships"
    ADD COLUMN "created_by" character varying NULL,
    ADD COLUMN "updated_by" character varying NULL,
    ADD COLUMN "deleted_at" timestamptz NULL,
    ADD COLUMN "deleted_by" character varying NULL;
