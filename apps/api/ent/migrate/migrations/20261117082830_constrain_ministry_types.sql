ALTER TABLE "ministries"
    ADD COLUMN "type" character varying NULL;

UPDATE "ministries"
SET "type" = "slug"
WHERE "slug" IN ('broadcast', 'music', 'kids');

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "ministries" WHERE "type" IS NULL) THEN
        RAISE EXCEPTION 'map existing ministry slugs to broadcast, music, or kids before migrating';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "ministries"
        WHERE "deleted_at" IS NULL
        GROUP BY "church_id", "type"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'merge duplicate active ministries of the same type before migrating';
    END IF;
END $$;

ALTER TABLE "ministries"
    ALTER COLUMN "type" SET NOT NULL,
    ADD CONSTRAINT "ministries_type_check" CHECK ("type" IN ('broadcast', 'music', 'kids'));

DROP INDEX "ministries_church_slug_key";

CREATE UNIQUE INDEX "ministries_church_type_active_key"
    ON "ministries" ("church_id", "type")
    WHERE "deleted_at" IS NULL;

ALTER TABLE "ministries"
    DROP COLUMN "slug";
