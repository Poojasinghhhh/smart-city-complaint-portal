-- Fix RLS Policies for Infinite Recursion Error
-- Run this script in Supabase SQL Editor to fix the 42P17 error

-- Drop all existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authorities and admins can view all profiles" ON public.profiles;

-- Recreate policies with correct conditions
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Authorities and admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );

-- Also fix complaints policies if they have similar issues
DROP POLICY IF EXISTS "Citizens can view their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Citizens can create their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authorities and admins can view all complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authorities can update complaints" ON public.complaints;

CREATE POLICY "Citizens can view their own complaints" 
  ON public.complaints FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Citizens can create their own complaints" 
  ON public.complaints FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorities and admins can view all complaints" 
  ON public.complaints FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );

CREATE POLICY "Authorities can update complaints" 
  ON public.complaints FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('authority', 'admin')
    )
  );
