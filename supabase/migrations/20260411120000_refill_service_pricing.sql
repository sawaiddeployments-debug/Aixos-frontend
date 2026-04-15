-- Refill: per-kg service pricing, partial acceptance on inquiry_items, notification typing.

BEGIN;

CREATE TABLE IF NOT EXISTS public.service_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    price_per_kg NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT service_pricing_service_name_unique UNIQUE (service_name)
);

CREATE INDEX IF NOT EXISTS idx_service_pricing_service_name_lower ON public.service_pricing (lower(service_name));

INSERT INTO public.service_pricing (service_name, price_per_kg)
VALUES
    ('CO2', 10),
    ('ABC Dry Powder', 8),
    ('Foam', 9),
    ('Dry Powder', 8)
ON CONFLICT (service_name) DO NOTHING;

ALTER TABLE public.inquiry_items
    ADD COLUMN IF NOT EXISTS accepted_quantity NUMERIC(12, 2);

-- If an older migration already added INTEGER, widen to numeric (kg may be fractional).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'inquiry_items'
          AND column_name = 'accepted_quantity'
          AND data_type = 'integer'
    ) THEN
        ALTER TABLE public.inquiry_items
            ALTER COLUMN accepted_quantity TYPE NUMERIC(12, 2)
            USING accepted_quantity::numeric;
    END IF;
END $$;

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS notification_type TEXT;

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_pricing_select_all" ON public.service_pricing;

CREATE POLICY "service_pricing_select_all" ON public.service_pricing FOR SELECT
    USING (TRUE);

COMMIT;
