-- Create complaint updates table for status history
CREATE TABLE IF NOT EXISTS public.complaint_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS complaint_updates_complaint_id_idx ON public.complaint_updates(complaint_id);
CREATE INDEX IF NOT EXISTS complaint_updates_created_at_idx ON public.complaint_updates(created_at DESC);

-- Enable RLS
ALTER TABLE public.complaint_updates ENABLE ROW LEVEL SECURITY;

-- Citizens can view updates on their own complaints
CREATE POLICY "Citizens can view updates on their complaints" 
  ON public.complaint_updates FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.complaints 
      WHERE complaints.id = complaint_updates.complaint_id 
      AND complaints.user_id = auth.uid()
    )
  );

-- Authorities can view all updates
CREATE POLICY "Authorities can view all updates" 
  ON public.complaint_updates FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );

-- Authorities can create updates
CREATE POLICY "Authorities can create updates" 
  ON public.complaint_updates FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );

-- Citizens can add comments to their own complaints
CREATE POLICY "Citizens can comment on their complaints" 
  ON public.complaint_updates FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.complaints 
      WHERE complaints.id = complaint_updates.complaint_id 
      AND complaints.user_id = auth.uid()
    )
  );
