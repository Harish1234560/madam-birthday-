-- Create storage bucket for memory photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-photos', 'memory-photos', true);

-- Allow anyone to view photos
CREATE POLICY "Anyone can view memory photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-photos');

-- Allow anyone to upload photos
CREATE POLICY "Anyone can upload memory photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'memory-photos');

-- Create table to track uploaded photos with metadata
CREATE TABLE public.memory_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploader_name TEXT NOT NULL,
  caption TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.memory_photos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view photos
CREATE POLICY "Anyone can view memory photos"
ON public.memory_photos
FOR SELECT
USING (true);

-- Allow anyone to add photos
CREATE POLICY "Anyone can add memory photos"
ON public.memory_photos
FOR INSERT
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.memory_photos;