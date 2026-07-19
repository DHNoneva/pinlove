
-- Set the store's admin/contact email to the new address, and make it the default for new rows
ALTER TABLE public.site_settings ALTER COLUMN contact_email SET DEFAULT 'pinlove.studio@outlook.com';

UPDATE public.site_settings
SET contact_email = 'pinlove.studio@outlook.com'
WHERE id = true;

-- Table to store contact form submissions from the website
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

DROP POLICY IF EXISTS "anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "anyone can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admins read contact messages" ON public.contact_messages;
CREATE POLICY "admins read contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "admins delete contact messages" ON public.contact_messages;
CREATE POLICY "admins delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
