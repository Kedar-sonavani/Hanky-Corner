-- Migration: Convert image_url to images array
-- Run this AFTER running the main schema.sql

-- Step 1: Add the new images column (if not already added)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Step 2: Migrate existing data from image_url to images array
UPDATE public.products 
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND images = '{}';

-- Step 3: Drop the old image_url column (optional - only if you want to clean up)
-- ALTER TABLE public.products DROP COLUMN IF EXISTS image_url;

-- Note: If you want to keep backward compatibility, keep both columns
-- and update your API to write to both fields
