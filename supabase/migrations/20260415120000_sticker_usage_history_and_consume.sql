BEGIN;

CREATE TABLE IF NOT EXISTS public.sticker_usage_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES public.partners (id) ON DELETE CASCADE,
    inquiry_id UUID NOT NULL REFERENCES public.inquiries (id) ON DELETE CASCADE,
    used_for TEXT NOT NULL CHECK (used_for IN ('validation', 'refilled')),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT sticker_usage_history_unique_inquiry UNIQUE (inquiry_id)
);

CREATE INDEX IF NOT EXISTS idx_sticker_usage_history_partner_id
    ON public.sticker_usage_history (partner_id);

CREATE INDEX IF NOT EXISTS idx_sticker_usage_history_created_at_desc
    ON public.sticker_usage_history (created_at DESC);

CREATE OR REPLACE FUNCTION public.consume_partner_sticker_for_inquiry(
    p_partner_id UUID,
    p_inquiry_id UUID,
    p_used_for TEXT
)
RETURNS TABLE (
    partner_id UUID,
    inquiry_id UUID,
    stickers_before INTEGER,
    stickers_after INTEGER,
    quantity_used INTEGER,
    skipped_duplicate BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_before INTEGER;
    v_after INTEGER;
    v_norm_type TEXT;
BEGIN
    IF p_partner_id IS NULL OR p_inquiry_id IS NULL THEN
        RAISE EXCEPTION 'partner_id and inquiry_id are required';
    END IF;

    v_norm_type := lower(trim(coalesce(p_used_for, '')));
    IF v_norm_type NOT IN ('validation', 'refilled') THEN
        RAISE EXCEPTION 'invalid used_for value: %', p_used_for;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.sticker_usage_history h
        WHERE h.inquiry_id = p_inquiry_id
    ) THEN
        RETURN QUERY
        SELECT
            p_partner_id,
            p_inquiry_id,
            NULL::INTEGER,
            NULL::INTEGER,
            0,
            TRUE;
        RETURN;
    END IF;

    SELECT p.stickers_total
    INTO v_before
    FROM public.partners p
    WHERE p.id = p_partner_id
    FOR UPDATE;

    IF v_before IS NULL THEN
        RAISE EXCEPTION 'partner not found: %', p_partner_id;
    END IF;

    IF v_before <= 0 THEN
        RAISE EXCEPTION 'No stickers available';
    END IF;

    UPDATE public.partners p
    SET stickers_total = p.stickers_total - 1
    WHERE p.id = p_partner_id
    RETURNING p.stickers_total
    INTO v_after;

    INSERT INTO public.sticker_usage_history (
        partner_id,
        inquiry_id,
        used_for,
        quantity
    )
    VALUES (
        p_partner_id,
        p_inquiry_id,
        v_norm_type,
        1
    );

    RETURN QUERY
    SELECT
        p_partner_id,
        p_inquiry_id,
        v_before,
        v_after,
        1,
        FALSE;
END;
$$;

ALTER TABLE public.sticker_usage_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sticker_usage_history_select_all" ON public.sticker_usage_history;
DROP POLICY IF EXISTS "sticker_usage_history_insert_all" ON public.sticker_usage_history;
DROP POLICY IF EXISTS "sticker_usage_history_update_all" ON public.sticker_usage_history;
DROP POLICY IF EXISTS "sticker_usage_history_delete_all" ON public.sticker_usage_history;

CREATE POLICY "sticker_usage_history_select_all"
    ON public.sticker_usage_history
    FOR SELECT
    USING (TRUE);

CREATE POLICY "sticker_usage_history_insert_all"
    ON public.sticker_usage_history
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "sticker_usage_history_update_all"
    ON public.sticker_usage_history
    FOR UPDATE
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "sticker_usage_history_delete_all"
    ON public.sticker_usage_history
    FOR DELETE
    USING (TRUE);

COMMIT;
