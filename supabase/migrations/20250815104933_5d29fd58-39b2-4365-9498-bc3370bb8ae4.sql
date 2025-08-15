-- Fix security issue: Restrict contact submissions access to admin users only
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to view submissions" ON public.contact_submissions;

-- Create a new restrictive policy that only allows admin users to view submissions
CREATE POLICY "Only admin users can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Keep the existing insert policy as is (public submissions should remain allowed)
-- "Allow public contact submissions" policy remains unchanged