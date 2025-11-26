-- Add template column to names table if it doesn't exist
ALTER TABLE public.names 
ADD COLUMN IF NOT EXISTS template TEXT DEFAULT '';

-- Update RLS policies if needed (already exist, but ensuring they work with new column)
CREATE POLICY "Allow public to view template" 
  ON public.names FOR SELECT 
  USING (TRUE);
