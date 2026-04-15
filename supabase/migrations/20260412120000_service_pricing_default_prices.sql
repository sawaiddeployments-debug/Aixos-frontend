-- Default per-kg prices for refill services (upsert so values stay in sync).

BEGIN;

INSERT INTO public.service_pricing (service_name, price_per_kg)
VALUES
    ('CO2', 10),
    ('Dry Powder', 8),
    ('Foam', 9),
    ('Water', 6),
    ('Clean Agent', 12)
ON CONFLICT (service_name) DO UPDATE
SET price_per_kg = EXCLUDED.price_per_kg;

COMMIT;
