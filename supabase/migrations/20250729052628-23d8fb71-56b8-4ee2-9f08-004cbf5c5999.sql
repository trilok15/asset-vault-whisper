-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  duration REAL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create asset_tags junction table
CREATE TABLE public.asset_tags (
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assets
CREATE POLICY "Assets are viewable by everyone" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Users can insert their own assets" ON public.assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assets" ON public.assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assets" ON public.assets FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Anyone can create tags" ON public.tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tags" ON public.tags FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tags" ON public.tags FOR DELETE USING (true);

-- RLS Policies for asset_tags
CREATE POLICY "Asset tags are viewable by everyone" ON public.asset_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can create asset tags" ON public.asset_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete asset tags" ON public.asset_tags FOR DELETE USING (true);

-- Storage policies for assets bucket
CREATE POLICY "Assets are publicly viewable" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Anyone can upload assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assets');
CREATE POLICY "Anyone can update assets" ON storage.objects FOR UPDATE USING (bucket_id = 'assets');
CREATE POLICY "Anyone can delete assets" ON storage.objects FOR DELETE USING (bucket_id = 'assets');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for assets
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy tags
INSERT INTO public.tags (name, color) VALUES 
  ('nature', '#10b981'),
  ('business', '#3b82f6'),
  ('technology', '#8b5cf6'),
  ('people', '#f59e0b'),
  ('abstract', '#ef4444'),
  ('food', '#84cc16'),
  ('travel', '#06b6d4'),
  ('architecture', '#6b7280');

-- Insert dummy assets (these will be placeholder entries)
INSERT INTO public.assets (filename, file_path, file_type, file_size, mime_type, width, height, description) VALUES 
  ('sunset-landscape.jpg', 'assets/sunset-landscape.jpg', 'image', 2456789, 'image/jpeg', 1920, 1080, 'Beautiful sunset over mountains'),
  ('office-meeting.jpg', 'assets/office-meeting.jpg', 'image', 1834567, 'image/jpeg', 1600, 900, 'Business meeting in modern office'),
  ('tech-workspace.jpg', 'assets/tech-workspace.jpg', 'image', 2123456, 'image/jpeg', 1920, 1280, 'Modern technology workspace with multiple monitors'),
  ('group-discussion.jpg', 'assets/group-discussion.jpg', 'image', 1956789, 'image/jpeg', 1600, 1200, 'Team collaboration and discussion'),
  ('abstract-art.jpg', 'assets/abstract-art.jpg', 'image', 1654321, 'image/jpeg', 1200, 1200, 'Colorful abstract digital art');

-- Link assets to tags (dummy data)
INSERT INTO public.asset_tags (asset_id, tag_id) VALUES 
  ((SELECT id FROM public.assets WHERE filename = 'sunset-landscape.jpg'), (SELECT id FROM public.tags WHERE name = 'nature')),
  ((SELECT id FROM public.assets WHERE filename = 'sunset-landscape.jpg'), (SELECT id FROM public.tags WHERE name = 'travel')),
  ((SELECT id FROM public.assets WHERE filename = 'office-meeting.jpg'), (SELECT id FROM public.tags WHERE name = 'business')),
  ((SELECT id FROM public.assets WHERE filename = 'office-meeting.jpg'), (SELECT id FROM public.tags WHERE name = 'people')),
  ((SELECT id FROM public.assets WHERE filename = 'tech-workspace.jpg'), (SELECT id FROM public.tags WHERE name = 'technology')),
  ((SELECT id FROM public.assets WHERE filename = 'tech-workspace.jpg'), (SELECT id FROM public.tags WHERE name = 'business')),
  ((SELECT id FROM public.assets WHERE filename = 'group-discussion.jpg'), (SELECT id FROM public.tags WHERE name = 'people')),
  ((SELECT id FROM public.assets WHERE filename = 'group-discussion.jpg'), (SELECT id FROM public.tags WHERE name = 'business')),
  ((SELECT id FROM public.assets WHERE filename = 'abstract-art.jpg'), (SELECT id FROM public.tags WHERE name = 'abstract'));