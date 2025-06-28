
-- Enable pgvector extension for RAG implementation
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table for RAG knowledge base
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  document_type TEXT CHECK (document_type IN ('research_paper', 'faq', 'guideline', 'report', 'extension_material')),
  category TEXT,
  embedding vector(1536), -- OpenAI ada-002 embedding dimension
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_users table for role-based access
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'content_admin', 'moderator')) DEFAULT 'moderator',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create video_generations table for MythBuster
CREATE TABLE public.video_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  script TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  status TEXT CHECK (status IN ('pending', 'generating', 'completed', 'failed')) DEFAULT 'pending',
  category TEXT,
  duration INTEGER, -- in seconds
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create misinformation_alerts table for ViralFarm
CREATE TABLE public.misinformation_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_platform TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('active', 'resolved', 'monitoring')) DEFAULT 'active',
  engagement_metrics JSONB DEFAULT '{}',
  detection_confidence DECIMAL(3,2) DEFAULT 0.50,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read documents (for fact-checking)
CREATE POLICY "Anyone can read documents" ON public.documents
  FOR SELECT USING (true);

-- Policy: Only admins can insert/update/delete documents
CREATE POLICY "Only admins can manage documents" ON public.documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Add RLS policies for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own admin status
CREATE POLICY "Users can view own admin status" ON public.admin_users
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Only super_admins can manage admin users
CREATE POLICY "Only super_admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Add RLS policies for video_generations
ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all completed videos
CREATE POLICY "Users can view completed videos" ON public.video_generations
  FOR SELECT USING (status = 'completed');

-- Policy: Admins can manage all videos
CREATE POLICY "Admins can manage videos" ON public.video_generations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Add RLS policies for misinformation_alerts
ALTER TABLE public.misinformation_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read alerts (for public awareness)
CREATE POLICY "Anyone can read alerts" ON public.misinformation_alerts
  FOR SELECT USING (true);

-- Policy: Only admins can manage alerts
CREATE POLICY "Only admins can manage alerts" ON public.misinformation_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_documents_embedding ON public.documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_video_generations_status ON public.video_generations(status);
CREATE INDEX idx_misinformation_alerts_severity ON public.misinformation_alerts(severity);
CREATE INDEX idx_misinformation_alerts_status ON public.misinformation_alerts(status);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$$;

-- Create function to get user admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT role FROM public.admin_users 
  WHERE admin_users.user_id = $1;
$$;
