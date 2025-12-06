
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Subscription
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT, -- 'weekly', 'monthly', 'yearly'
  subscription_expires_at TIMESTAMPTZ,
  revenuecat_id TEXT,
  
  -- Usage
  free_analyses_used INT DEFAULT 0,
  free_analyses_reset_at TIMESTAMPTZ DEFAULT NOW(),
  total_analyses INT DEFAULT 0,
  
  -- Quiz
  attachment_style TEXT,
  quiz_completed_at TIMESTAMPTZ,
  
  -- Settings
  notifications_daily BOOLEAN DEFAULT TRUE,
  notifications_weekly BOOLEAN DEFAULT TRUE,
  analytics_enabled BOOLEAN DEFAULT TRUE
);

-- Analyses
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Input
  input_type TEXT CHECK (input_type IN ('screenshot', 'text', 'voice')),
  
  -- Results (stored as JSONB for flexibility)
  red_flags JSONB, -- [{type, evidence, explanation}]
  green_flags JSONB,
  toxicity_score INT,
  toxicity_verdict TEXT,
  toxicity_summary TEXT,
  attachment_style TEXT,
  attachment_explanation TEXT,
  
  -- Meta
  is_saved BOOLEAN DEFAULT FALSE -- "Receipts"
);

-- Quiz responses (for potential future personalization)
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responses JSONB, -- {q1: 'a', q2: 'c', ...}
  result TEXT -- attachment style
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to create profile on signup
-- (Optional but recommended)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
