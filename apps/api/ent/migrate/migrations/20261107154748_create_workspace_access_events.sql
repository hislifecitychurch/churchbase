CREATE TABLE "workspace_access_events" (
    "id" uuid NOT NULL,
    "entry_id" uuid NOT NULL,
    "workspace" character varying NOT NULL,
    "occurred_at" timestamptz NOT NULL DEFAULT now(),
    "user_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "workspace_access_events_users_workspace_access_events"
        FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
    CONSTRAINT "workspace_access_events_workspace_check"
        CHECK ("workspace" IN ('app', 'platform'))
);

CREATE UNIQUE INDEX "workspace_access_events_user_workspace_entry_key"
    ON "workspace_access_events" ("user_id", "workspace", "entry_id");
CREATE INDEX "workspace_access_events_user_id_occurred_at"
    ON "workspace_access_events" ("user_id", "occurred_at");
CREATE INDEX "workspace_access_events_workspace_occurred_at"
    ON "workspace_access_events" ("workspace", "occurred_at");
