-- Defense-in-depth constraints for anonymous contact submissions.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'contact_messages_name_length'
      AND conrelid = 'public.contact_messages'::regclass
  ) THEN
    ALTER TABLE public.contact_messages
      ADD CONSTRAINT contact_messages_name_length CHECK (char_length(btrim(name)) BETWEEN 1 AND 120);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'contact_messages_email_format'
      AND conrelid = 'public.contact_messages'::regclass
  ) THEN
    ALTER TABLE public.contact_messages
      ADD CONSTRAINT contact_messages_email_format CHECK (char_length(email) <= 255 AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'contact_messages_message_length'
      AND conrelid = 'public.contact_messages'::regclass
  ) THEN
    ALTER TABLE public.contact_messages
      ADD CONSTRAINT contact_messages_message_length CHECK (char_length(btrim(message)) BETWEEN 1 AND 2000);
  END IF;
END $$;

DROP POLICY IF EXISTS "anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "anyone can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 120
    AND char_length(email) <= 255
    AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    AND char_length(btrim(message)) BETWEEN 1 AND 2000
  );

-- Restrict browser uploads to common raster formats. This is defense in depth;
-- the application also validates the file before upload.
DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'products'
    AND has_role(auth.uid(), 'admin'::app_role)
    AND (metadata->>'mimetype') IN ('image/jpeg', 'image/png', 'image/webp')
  );

DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
CREATE POLICY "Admins update product images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'products' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (
    bucket_id = 'products'
    AND has_role(auth.uid(), 'admin'::app_role)
    AND (metadata->>'mimetype') IN ('image/jpeg', 'image/png', 'image/webp')
  );
