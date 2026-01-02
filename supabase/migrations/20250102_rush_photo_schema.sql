-- RUSH PHOTO SUPABASE SCHEMA

-- 1. USERS (Shared or Independent)
-- Assuming 'users' table exists from rush-video project.
-- If not, create it.
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT, -- Hash
  image TEXT,
  role TEXT DEFAULT 'customer', -- Added for simple role management if not relying on env
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Extra fields if needed
  google_id TEXT UNIQUE,
  phone TEXT,
  company TEXT
);

-- 2. PRICING CONFIG (Shared)
CREATE TABLE IF NOT EXISTS pricing_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL, -- Stores the JSON settings
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RUSH ORDERS (Photo specific)
CREATE TABLE IF NOT EXISTS rush_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Core fields
  user_id UUID REFERENCES users(id),
  order_number TEXT UNIQUE NOT NULL, -- e.g. RUSH-X7A
  status TEXT DEFAULT 'pending', -- pending, paid, processing, completed
  
  -- Customer Details
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  company TEXT,
  
  -- Order Specifics
  package_type TEXT NOT NULL, -- ecommerce, lifestyle, fullpackage
  product_name TEXT NOT NULL,
  notes TEXT,
  
  -- Detailed Data (Cart items, styles, etc stored as JSON to be flexible)
  cart_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  totals_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Logistics
  tracking_number TEXT, -- Shipping tracking, distinct from order_number
  delivery_url TEXT,
  
  -- Payment
  payment_provider TEXT, -- stripe, invoice
  payment_session_id TEXT, -- stripe session id
  payment_status TEXT, -- created, paid, failed
  
  -- Meta
  discount_code TEXT,
  lifestyle_included BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rush_orders_customer_email ON rush_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_rush_orders_status ON rush_orders(status);
CREATE INDEX IF NOT EXISTS idx_rush_orders_created_at ON rush_orders(created_at DESC);

-- RLS Policies (Simple public access for now, similar to reference project)
ALTER TABLE rush_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select rush_orders" ON rush_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert rush_orders" ON rush_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update rush_orders" ON rush_orders FOR UPDATE USING (true);

