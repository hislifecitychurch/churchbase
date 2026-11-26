CREATE TABLE "church_memberships" (
    "id" uuid NOT NULL,
    "auth_user_id" character varying NOT NULL,
    "role" character varying NOT NULL DEFAULT 'member',
    "status" character varying NOT NULL DEFAULT 'active',
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "church_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "church_memberships_churches_church_memberships"
        FOREIGN KEY ("church_id") REFERENCES "churches" ("id"),
    CONSTRAINT "church_memberships_auth_user_id_check"
        CHECK (length(trim("auth_user_id")) > 0),
    CONSTRAINT "church_memberships_role_check"
        CHECK ("role" IN ('admin', 'member')),
    CONSTRAINT "church_memberships_status_check"
        CHECK ("status" IN ('active', 'suspended'))
);

CREATE UNIQUE INDEX "church_memberships_church_user_key"
    ON "church_memberships" ("church_id", "auth_user_id");
CREATE INDEX "churchmembership_auth_user_id"
    ON "church_memberships" ("auth_user_id");

CREATE TABLE "ministries" (
    "id" uuid NOT NULL,
    "name" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "church_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "ministries_churches_ministries"
        FOREIGN KEY ("church_id") REFERENCES "churches" ("id"),
    CONSTRAINT "ministries_name_check"
        CHECK (length(trim("name")) > 0),
    CONSTRAINT "ministries_slug_check"
        CHECK (length(trim("slug")) > 0)
);

CREATE UNIQUE INDEX "ministries_church_slug_key"
    ON "ministries" ("church_id", "slug");

CREATE TABLE "ministry_memberships" (
    "id" uuid NOT NULL,
    "role" character varying NOT NULL DEFAULT 'member',
    "status" character varying NOT NULL DEFAULT 'active',
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "church_membership_id" uuid NOT NULL,
    "ministry_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "ministry_memberships_church_memberships_ministry_memberships"
        FOREIGN KEY ("church_membership_id") REFERENCES "church_memberships" ("id"),
    CONSTRAINT "ministry_memberships_ministries_ministry_memberships"
        FOREIGN KEY ("ministry_id") REFERENCES "ministries" ("id"),
    CONSTRAINT "ministry_memberships_role_check"
        CHECK ("role" IN ('leader', 'member')),
    CONSTRAINT "ministry_memberships_status_check"
        CHECK ("status" IN ('active', 'suspended'))
);

CREATE UNIQUE INDEX "ministry_memberships_ministry_member_key"
    ON "ministry_memberships" ("ministry_id", "church_membership_id");
CREATE INDEX "ministrymembership_church_membership_id"
    ON "ministry_memberships" ("church_membership_id");
