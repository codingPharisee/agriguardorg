
-- Create a table to store contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interests TEXT NOT NULL,
  newsletter BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert contact submissions (since this is a public contact form)
CREATE POLICY "Allow public contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Create policy that allows authenticated users to view all submissions (for admin purposes)
CREATE POLICY "Allow authenticated users to view submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  TO authenticated
  USING (true);
