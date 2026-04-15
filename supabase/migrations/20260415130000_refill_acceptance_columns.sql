BEGIN;

ALTER TABLE public.inquiry_items
    ADD COLUMN IF NOT EXISTS accepted_kg NUMERIC;

ALTER TABLE public.inquiry_items
    ADD COLUMN IF NOT EXISTS rejected_kg NUMERIC;

COMMIT;
