-- 20260406230000_quotations_setup.sql
-- 1. Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries (id) ON DELETE CASCADE,
    partner_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    estimated_cost NUMERIC(12, 2),
    pdf_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT quotations_inquiry_id_key UNIQUE (inquiry_id)
);

-- 2. Create storage bucket for quotations
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotations', 'quotations', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS for the table
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all select for quotations" ON public.quotations;
DROP POLICY IF EXISTS "Allow all insert for quotations" ON public.quotations;
DROP POLICY IF EXISTS "Allow all update for quotations" ON public.quotations;

CREATE POLICY "Allow all select for quotations" ON public.quotations FOR SELECT USING (true);
CREATE POLICY "Allow all insert for quotations" ON public.quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for quotations" ON public.quotations FOR UPDATE USING (true) WITH CHECK (true);

-- 4. Set up RLS for storage objects
DROP POLICY IF EXISTS "Allow quotation storage read" ON storage.objects;
DROP POLICY IF EXISTS "Allow quotation storage insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow quotation storage update" ON storage.objects;

CREATE POLICY "Allow quotation storage read"
    ON storage.objects FOR SELECT USING (bucket_id = 'quotations');

CREATE POLICY "Allow quotation storage insert"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'quotations');

CREATE POLICY "Allow quotation storage update"
    ON storage.objects FOR UPDATE USING (bucket_id = 'quotations');
