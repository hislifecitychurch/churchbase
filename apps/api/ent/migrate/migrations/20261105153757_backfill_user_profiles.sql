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

INSERT INTO "user_profiles" ("id", "user_id")
SELECT "churchbase_uuidv7"(), "users"."id"
FROM "users"
WHERE NOT EXISTS (
    SELECT 1
    FROM "user_profiles"
    WHERE "user_profiles"."user_id" = "users"."id"
)
ON CONFLICT ("user_id") DO NOTHING;

DROP FUNCTION "churchbase_uuidv7"();
