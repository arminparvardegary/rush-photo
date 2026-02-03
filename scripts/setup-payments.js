require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPayments() {
  console.log('🚀 Setting up payment transactions table...\n');

  const migrationPath = path.join(
    __dirname,
    '..',
    'supabase',
    'migrations',
    '20250203_payment_transactions.sql'
  );

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Skip comments
    if (statement.trim().startsWith('--') || statement.trim().startsWith('/*')) {
      continue;
    }

    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    console.log(statement.substring(0, 80) + '...\n');

    try {
      const { error } = await supabase.rpc('exec', { sql: statement });

      if (error) {
        // Some errors are okay (like "already exists")
        if (error.message && error.message.includes('already exists')) {
          console.log('⚠️  Already exists, skipping...\n');
          continue;
        }

        console.error('❌ Error:', error);
        // Continue with next statement instead of exiting
        continue;
      }

      console.log('✅ Success\n');
    } catch (err) {
      console.error('❌ Exception:', err.message);
      // Continue with next statement
      continue;
    }
  }

  console.log('\n✅ Payment setup complete!');
  console.log('\nNext steps:');
  console.log('1. Add STRIPE_WEBHOOK_SECRET to your .env.local');
  console.log('2. Configure webhook in Stripe dashboard: https://dashboard.stripe.com/webhooks');
  console.log('3. Webhook URL: https://your-domain.com/api/webhooks/stripe');
  console.log('4. Select events: checkout.session.completed, charge.refunded');
}

setupPayments().catch(err => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
