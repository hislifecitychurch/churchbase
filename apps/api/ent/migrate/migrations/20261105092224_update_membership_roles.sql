ALTER TABLE "church_memberships"
    DROP CONSTRAINT "church_memberships_role_check";
ALTER TABLE "ministry_memberships"
    DROP CONSTRAINT "ministry_memberships_role_check";

UPDATE "ministry_memberships"
SET "role" = 'lead'
WHERE "role" = 'leader';

ALTER TABLE "church_memberships"
    ADD CONSTRAINT "church_memberships_role_check"
        CHECK ("role" IN ('admin', 'staff', 'member'));
ALTER TABLE "ministry_memberships"
    ADD CONSTRAINT "ministry_memberships_role_check"
        CHECK ("role" IN ('lead', 'member'));
