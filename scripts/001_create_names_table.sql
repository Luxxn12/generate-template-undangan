-- Create names table for storing template names
CREATE TABLE IF NOT EXISTS public.names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.names ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view, insert, update, and delete all records (no authentication required for this app)
CREATE POLICY "Allow public to view names" 
  ON public.names FOR SELECT 
  USING (TRUE);

CREATE POLICY "Allow public to insert names" 
  ON public.names FOR INSERT 
  WITH CHECK (TRUE);

CREATE POLICY "Allow public to update names" 
  ON public.names FOR UPDATE 
  USING (TRUE);

CREATE POLICY "Allow public to delete names" 
  ON public.names FOR DELETE 
  USING (TRUE);
