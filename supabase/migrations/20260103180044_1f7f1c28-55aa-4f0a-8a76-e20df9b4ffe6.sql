-- Create guestbook table for birthday wishes
CREATE TABLE public.guestbook (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  emoji TEXT DEFAULT '🎂',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read wishes (public guestbook)
CREATE POLICY "Anyone can view guestbook entries"
ON public.guestbook
FOR SELECT
USING (true);

-- Allow anyone to insert wishes (no auth required for birthday wishes)
CREATE POLICY "Anyone can add guestbook entries"
ON public.guestbook
FOR INSERT
WITH CHECK (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook;