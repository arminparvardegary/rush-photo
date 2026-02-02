-- USER PROFILES TABLE
-- Stores additional user profile data like shipping address

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  apartment TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'United States',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(user_email);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select user_profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update user_profiles" ON user_profiles FOR UPDATE USING (true);
