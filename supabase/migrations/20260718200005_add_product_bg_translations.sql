-- Add optional Bulgarian translations for product content.
-- These are all nullable: when empty, the storefront falls back to the
-- English (default) column, so nothing breaks for existing products.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name_bg text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS eyebrow_bg text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions_bg text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS artisan_note_bg text;
