-- Standardize agents.status: pending | accepted | rejected | hold (default pending)
-- Migrates legacy values: Active→accepted, Pending→pending, Suspended→rejected
-- Also adds missing RLS policies for UPDATE (required by admin panel)

-- 1. Add UPDATE policy so the anon/public role can update agents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'agents' AND policyname = 'Allow update all'
  ) THEN
    CREATE POLICY "Allow update all" ON public.agents
      FOR UPDATE TO public USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 2. Ensure the status column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'agents' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.agents ADD COLUMN status text NOT NULL DEFAULT 'pending';
  END IF;

  -- Normalize existing values to lowercase
  UPDATE public.agents SET status = lower(trim(status::text)) WHERE status IS NOT NULL;

  -- Map legacy values
  UPDATE public.agents SET status = 'accepted' WHERE status = 'active';
  UPDATE public.agents SET status = 'rejected' WHERE status = 'suspended';

  -- Anything null → pending
  UPDATE public.agents SET status = 'pending' WHERE status IS NULL;

  -- Anything not in the allowed set → pending
  UPDATE public.agents
  SET status = 'pending'
  WHERE status IS NOT NULL AND status NOT IN ('pending', 'accepted', 'rejected', 'hold');

  -- Set correct default
  ALTER TABLE public.agents ALTER COLUMN status SET DEFAULT 'pending';

  -- Add CHECK constraint
  ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_status_check;
  ALTER TABLE public.agents
    ADD CONSTRAINT agents_status_check
    CHECK (status IN ('pending', 'accepted', 'rejected', 'hold'));
END $$;
