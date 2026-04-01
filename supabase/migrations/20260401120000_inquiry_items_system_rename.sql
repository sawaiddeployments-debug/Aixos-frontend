-- Rename inquiry_items.firefighting_system -> system and drop deprecated columns.
-- Safe for existing records: rename preserves data in-place.

BEGIN;

ALTER TABLE public.inquiry_items
    RENAME COLUMN firefighting_system TO system;

ALTER TABLE public.inquiry_items
    DROP COLUMN IF EXISTS fire_alarm_system,
    DROP COLUMN IF EXISTS pump_type;

COMMIT;
