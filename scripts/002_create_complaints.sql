-- Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('roads', 'water', 'electricity', 'sanitation', 'streetlights', 'drainage')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS complaints_user_id_idx ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS complaints_status_idx ON public.complaints(status);
CREATE INDEX IF NOT EXISTS complaints_category_idx ON public.complaints(category);
CREATE INDEX IF NOT EXISTS complaints_created_at_idx ON public.complaints(created_at DESC);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Citizens can view their own complaints
CREATE POLICY "Citizens can view their own complaints" 
  ON public.complaints FOR SELECT 
  USING (auth.uid() = user_id);

-- Citizens can create their own complaints
CREATE POLICY "Citizens can create complaints" 
  ON public.complaints FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Authorities can view all complaints
CREATE POLICY "Authorities can view all complaints" 
  ON public.complaints FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );

-- Authorities can update complaints
CREATE POLICY "Authorities can update complaints" 
  ON public.complaints FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;

CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
