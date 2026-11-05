ALTER TABLE "user_profiles"
    ADD COLUMN "date_of_birth" date NULL,
    ADD COLUMN "address_line_1" character varying NULL,
    ADD COLUMN "address_line_2" character varying NULL,
    ADD COLUMN "city" character varying NULL,
    ADD COLUMN "state_province" character varying NULL,
    ADD COLUMN "postal_code" character varying NULL,
    ADD COLUMN "country_code" character varying(2) NULL,
    ADD COLUMN "emergency_contact_name" character varying NULL,
    ADD COLUMN "emergency_contact_relationship" character varying NULL,
    ADD COLUMN "emergency_contact_phone_number" character varying NULL;
