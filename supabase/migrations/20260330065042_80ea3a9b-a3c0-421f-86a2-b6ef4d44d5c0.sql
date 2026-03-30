
-- Remove overly permissive INSERT policy on profiles
-- The handle_new_user trigger runs as SECURITY DEFINER and bypasses RLS
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
