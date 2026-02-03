-- Payment Transactions Table
-- Stores all payment-related transactions including charges, refunds, etc.

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Order reference
  order_id UUID REFERENCES rush_orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,

  -- Transaction details
  transaction_type TEXT NOT NULL, -- 'charge', 'refund', 'partial_refund'
  provider TEXT NOT NULL, -- 'stripe'
  provider_transaction_id TEXT, -- stripe charge/refund ID

  -- Amounts (in cents for precision)
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',

  -- Status
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'canceled'

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Error info (if failed)
  error_code TEXT,
  error_message TEXT,

  -- Admin info (for refunds)
  processed_by_user_id UUID REFERENCES users(id),
  refund_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_number ON payment_transactions(order_number);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_transaction_id ON payment_transactions(provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(transaction_type);

-- RLS Policies
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin full access to payment_transactions"
  ON payment_transactions
  FOR ALL
  USING (true);

-- Add columns to rush_orders for better payment tracking
ALTER TABLE rush_orders ADD COLUMN IF NOT EXISTS payment_amount_cents INTEGER;
ALTER TABLE rush_orders ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'usd';
ALTER TABLE rush_orders ADD COLUMN IF NOT EXISTS payment_charge_id TEXT;
ALTER TABLE rush_orders ADD COLUMN IF NOT EXISTS payment_paid_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE rush_orders ADD COLUMN IF NOT EXISTS refund_amount_cents INTEGER DEFAULT 0;
ALTER TABLE rush_orders ADD COLUMN IF NOT EXISTS refund_status TEXT; -- 'none', 'partial', 'full'

-- Index for payment charge ID lookup
CREATE INDEX IF NOT EXISTS idx_rush_orders_payment_charge_id ON rush_orders(payment_charge_id);

COMMENT ON TABLE payment_transactions IS 'Stores all payment transactions including charges and refunds';
COMMENT ON COLUMN payment_transactions.amount_cents IS 'Amount in cents (e.g., $10.00 = 1000)';
COMMENT ON COLUMN payment_transactions.transaction_type IS 'Type: charge, refund, partial_refund';
