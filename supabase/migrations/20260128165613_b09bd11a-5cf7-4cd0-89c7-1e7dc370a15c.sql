-- Drop the overly permissive policy
DROP POLICY "Anyone can create service requests" ON public.service_requests;

-- Create a more secure policy with rate limiting
CREATE POLICY "Rate limited service requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (
    (SELECT count(*) FROM public.service_requests 
     WHERE created_at > (now() - interval '1 hour')) < 50
  );