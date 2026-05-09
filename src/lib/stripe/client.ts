import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // We use console.warn instead of error here to avoid breaking the build if the key is missing in CI
  // The framework will handle missing keys gracefully in the UI
  console.warn('[Stripe] STRIPE_SECRET_KEY is missing. Payment features will be disabled.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // Use the latest API version or specify a known stable one
  apiVersion: '2025-02-24-preview' as any,
  appInfo: {
    name: 'Ayato Studio Portal',
    version: '1.0.0',
  },
});
