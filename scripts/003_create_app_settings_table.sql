-- Create app_settings table for storing template and other app-wide settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  template TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view and update settings
CREATE POLICY "Allow public to view settings" 
  ON public.app_settings FOR SELECT 
  USING (TRUE);

CREATE POLICY "Allow public to update settings" 
  ON public.app_settings FOR UPDATE 
  USING (TRUE);

CREATE POLICY "Allow public to insert settings" 
  ON public.app_settings FOR INSERT 
  WITH CHECK (TRUE);
