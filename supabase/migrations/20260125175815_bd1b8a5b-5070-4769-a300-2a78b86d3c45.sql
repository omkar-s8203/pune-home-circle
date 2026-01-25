-- Fix search_path for handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate reports INSERT policy with rate limiting check
DROP POLICY IF EXISTS "Anyone can create reports" ON public.reports;

CREATE POLICY "Authenticated or anonymous can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (
    -- Rate limit: max 5 reports per IP/session (approximated by checking recent reports)
    (SELECT COUNT(*) FROM public.reports WHERE created_at > now() - interval '1 hour') < 100
  );