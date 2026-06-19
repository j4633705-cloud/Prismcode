# Polar.sh Setup Guide

This guide walks through setting up Polar.sh for PrismCode billing.

## 1. Create a Polar.sh account

1. Go to https://polar.sh and sign up
2. Complete organization setup

## 2. Create Products

Create three products in Polar:

### Free ($0/mo)
- Price: Free
- No Polar product needed (handled in-app)

### Pro ($20/mo)
- Price: Fixed recurring, $20/month
- After creating, note the **Product ID** from the URL or API
- Set `POLAR_PRO_PRODUCT_ID` in `.env`

### Enterprise ($100/mo)
- Price: Fixed recurring, $100/month
- After creating, note the **Product ID**
- Set `POLAR_ENTERPRISE_PRODUCT_ID` in `.env`

## 3. Create a Meter for Credits

1. In Polar dashboard, go to **Meters**
2. Create a meter: name `prismcode_credits`, unit `credits`
3. Note the **Meter ID**
4. Set `POLAR_CREDITS_METER_ID` in `.env`
5. Attach this meter to both Pro and Enterprise products

## 4. Generate Access Token

1. In Polar dashboard, go to **Settings → Access Tokens**
2. Create a new token with scopes:
   - `products:read`
   - `products:write`
   - `checkouts:read`
   - `checkouts:write`
   - `customer_sessions:write`
   - `events:write`
   - `customers:read`
   - `customers:write`
   - `subscriptions:read`
3. Set `POLAR_ACCESS_TOKEN` in `.env`

## 5. Configure Webhook

1. In Polar dashboard, go to **Settings → Webhooks**
2. Add endpoint: `https://your-domain.com/polar/webhook`
3. Select events:
   - `subscription.active`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.revoked`
   - `subscription.past_due`
   - `order.paid`
4. Copy the webhook secret
5. Set `POLAR_WEBHOOK_SECRET` in `.env`

## 6. Environment Variables

```env
POLAR_ACCESS_TOKEN=     # From step 4
POLAR_SERVER=sandbox    # Use 'sandbox' for testing, 'production' for live
POLAR_CREDITS_METER_ID= # From step 3
POLAR_PRO_PRODUCT_ID=   # From step 2
POLAR_ENTERPRISE_PRODUCT_ID= # From step 2
POLAR_WEBHOOK_SECRET=   # From step 5
```

## 7. Test the Flow

1. Start the server: `bun run dev:server`
2. Open the landing page and click "Upgrade to Pro"
3. Complete the Polar checkout in sandbox mode
4. Verify the webhook fires and subscription syncs

## Architecture

```
User clicks "Upgrade" 
  → POST /billing/checkout 
    → Polar.createCheckout() 
      → Redirect to Polar checkout page
        → User completes payment
          → Polar sends webhook
            → POST /polar/webhook
              → syncSubscription() updates plan in DB
```

Webhook events sync:
- `subscription.active` / `.created` / `.updated` → update plan + subscription record
- `subscription.canceled` / `.revoked` → revert to free plan
- `order.paid` → handle initial payment + subscription creation
