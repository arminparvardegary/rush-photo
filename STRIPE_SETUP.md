# Stripe Payment Integration - Setup Guide

This guide will help you complete the Stripe payment integration with full refund capabilities.

## ✅ What's Already Done

- ✅ Stripe checkout flow
- ✅ Payment webhook handler
- ✅ Transaction tracking system
- ✅ Admin panel payment UI
- ✅ Refund functionality
- ✅ Payment confirmation emails

## 🔧 Setup Steps

### 1. Database Migration

Run the payment transactions migration in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/erprxebtmoumuqrfncze/sql/new
2. Copy the contents of `supabase/migrations/20250203_payment_transactions.sql`
3. Paste and click "Run"

This will create:
- `payment_transactions` table for tracking all payments/refunds
- Additional columns in `rush_orders` for payment tracking

### 2. Stripe Webhook Configuration

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `charge.refunded`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. Copy the "Signing secret" (starts with `whsec_`)

### 3. Environment Variables

Add to your `.env.local`:

```bash
# Stripe Keys (already added)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Webhook Secret (NEW - add this)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Test the Integration

#### Test Payment Flow:
1. Go to `/order` page
2. Add items to cart
3. Fill checkout form
4. Complete payment with Stripe test card: `4242 4242 4242 4242`
5. Check admin panel - order should show as "paid"

#### Test Refund Flow:
1. Go to admin panel: `/admin/orders`
2. Click on a paid order
3. Scroll to "Payment & Refunds" section
4. Click "Issue Refund"
5. Enter amount (or leave empty for full refund)
6. Add reason and submit
7. Refund will be processed immediately

## 🎯 Features Available

### For Customers:
- ✅ Secure Stripe checkout
- ✅ Multiple payment methods (card, Apple Pay, Google Pay)
- ✅ Automatic payment confirmation
- ✅ Order tracking

### For Admins:
- ✅ View all payment transactions
- ✅ Process full refunds
- ✅ Process partial refunds
- ✅ Add refund reasons
- ✅ View transaction history
- ✅ Real-time payment status
- ✅ Audit trail for all transactions

## 📊 Admin Panel Guide

### Viewing Payments:
1. Navigate to `/admin/orders/[id]`
2. Scroll to "Payment & Refunds" section
3. View:
   - Total charged amount
   - Total refunded amount
   - Available refund amount
   - Complete transaction history

### Processing Refunds:
1. Click "Issue Refund" button
2. Options:
   - Leave amount empty = Full refund
   - Enter amount = Partial refund
3. Add reason (optional but recommended)
4. Click "Process Refund"
5. Confirmation will appear
6. Customer is automatically refunded in Stripe

## 🔒 Security Features

- ✅ Webhook signature verification
- ✅ Admin authentication required
- ✅ Secure API endpoints
- ✅ Service role key for sensitive operations
- ✅ Transaction audit trail

## 📝 Database Schema

### payment_transactions Table:
- `id` - Unique transaction ID
- `order_id` - Reference to order
- `transaction_type` - 'charge' | 'refund' | 'partial_refund'
- `amount_cents` - Amount in cents
- `status` - 'succeeded' | 'failed' | 'pending'
- `provider_transaction_id` - Stripe charge/refund ID
- `refund_reason` - Admin-provided reason
- `created_at` - Transaction timestamp

### Additional rush_orders Columns:
- `payment_amount_cents` - Total charged
- `payment_charge_id` - Stripe charge ID
- `payment_paid_at` - Payment timestamp
- `refund_amount_cents` - Total refunded
- `refund_status` - 'none' | 'partial' | 'full'

## 🚀 Next Steps

1. Run the database migration (see step 1)
2. Configure Stripe webhook (see step 2)
3. Add webhook secret to .env.local (see step 3)
4. Test payment flow
5. Test refund functionality
6. Monitor transactions in admin panel

## 🐛 Troubleshooting

### Webhook not working?
- Check webhook URL is correct
- Verify STRIPE_WEBHOOK_SECRET is set
- Check webhook signature verification
- View webhook logs in Stripe dashboard

### Refund failing?
- Ensure order has a valid charge ID
- Check admin permissions
- Verify Stripe secret key has refund permissions
- Check refund amount doesn't exceed available amount

### Transactions not showing?
- Verify migration was run successfully
- Check database permissions
- Ensure order has payment data

## 📞 Support

For issues or questions:
- Check server logs for errors
- View Stripe dashboard for payment details
- Review webhook delivery in Stripe dashboard
- Check Supabase logs for database errors

---

**Integration Complete! 🎉**

Your Stripe payment system is fully functional with:
- Automatic payment processing
- Real-time webhook updates
- Full transaction tracking
- Admin refund capabilities
- Security and audit trails
