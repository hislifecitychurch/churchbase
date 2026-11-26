ALTER TABLE "church_memberships"
    DROP CONSTRAINT "church_memberships_status_check";
ALTER TABLE "ministry_memberships"
    DROP CONSTRAINT "ministry_memberships_status_check";

UPDATE "church_memberships"
SET "status" = 'inactive'
WHERE "status" = 'suspended';
UPDATE "ministry_memberships"
SET "status" = 'inactive'
WHERE "status" = 'suspended';

ALTER TABLE "church_memberships"
    ADD CONSTRAINT "church_memberships_status_check"
        CHECK ("status" IN ('active', 'inactive'));
ALTER TABLE "ministry_memberships"
    ADD CONSTRAINT "ministry_memberships_status_check"
        CHECK ("status" IN ('active', 'inactive'));
