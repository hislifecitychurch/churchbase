ALTER TABLE "churches"
    ADD COLUMN "city" text NULL,
    ADD COLUMN "state_or_province" text NULL,
    ADD COLUMN "country_code" character varying(2) NULL,
    ADD CONSTRAINT "churches_country_code_check" CHECK (
        "country_code" IS NULL OR (
            length("country_code") = 2
            AND "country_code" = upper("country_code")
            AND substr("country_code", 1, 1) BETWEEN 'A' AND 'Z'
            AND substr("country_code", 2, 1) BETWEEN 'A' AND 'Z'
        )
    );
