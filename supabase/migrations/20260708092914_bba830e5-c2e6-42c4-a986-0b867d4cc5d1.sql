
-- 1. Lock down SECURITY DEFINER helpers not meant to be called directly
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 2. Replace always-true custom_requests INSERT policy with a non-trivial check
DROP POLICY IF EXISTS "Anyone can submit a custom request" ON public.custom_requests;
CREATE POLICY "Anyone can submit a custom request"
  ON public.custom_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(full_name)) > 0
    AND length(btrim(email)) > 3
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  );

-- 3. Remove the broad SELECT policy that allows listing the public products bucket
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
