-- SIMPLE RLS FIX - Run this in Supabase SQL Editor

-- Disable RLS temporarily to allow access
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simple policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authorities and admins can view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Citizens can view their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Citizens can create their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authorities and admins can view all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authorities can update complaints" ON public.complaints;

-- Create simple, non-recursive policies
CREATE POLICY "Enable insert for authenticated users" ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable select for users based on id" ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for complaints" ON public.complaints FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Enable select for complaints (users can see their own, admins can see all)
CREATE POLICY "Enable select for complaints" ON public.complaints FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable update for complaints (users can update their own, admins can update all)
CREATE POLICY "Enable update for complaints" ON public.complaints FOR UPDATE USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
