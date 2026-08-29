'use server';

import { stripe } from '@/lib/stripe/client';
import { headers } from 'next/headers';

export interface CheckoutParams {
  productId?: string;
  planId?: string;
  priceId?: string; // Stripe Price ID (e.g. price_12345)
  amount?: number; // Custom amount in JPY (fallback if priceId not given)
  tierName: string;
  mode?: 'subscription' | 'payment';
  userId?: string;
  userEmail?: string;
  successPath?: string;
  cancelPath?: string;
}

/**
 * Creates a Stripe Checkout Session for Subscription or One-Time Payment
 */
export async function createCheckoutSession(params: CheckoutParams) {
  const {
    priceId,
    amount,
    tierName,
    productId = 'general',
    planId = 'standard',
    mode = 'subscription',
    userId,
    userEmail,
    successPath = '/support?success=true',
    cancelPath = '/support?canceled=true',
  } = params;

  const headerList = await headers();
  const origin = headerList.get('origin') || 'https://ayato-studio.ai';

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Payment gateway is not configured. Please set STRIPE_SECRET_KEY.' };
  }

  try {
    let lineItems: any[] = [];

    if (priceId) {
      // Use existing Stripe Price ID
      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
    } else if (amount && amount > 0) {
      // Dynamically create ad-hoc price data
      lineItems = [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `${tierName}`,
              description: `Ayato Studio - ${tierName}`,
              metadata: {
                productId,
                planId,
              },
            },
            unit_amount: amount,
            ...(mode === 'subscription' ? { recurring: { interval: 'month' } } : {}),
          },
          quantity: 1,
        },
      ];
    } else {
      return { error: 'Invalid price or amount.' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      customer_email: userEmail,
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
      metadata: {
        userId: userId || '',
        userEmail: userEmail || '',
        productId,
        planId,
        tierName,
        mode,
      },
      subscription_data:
        mode === 'subscription'
          ? {
              metadata: {
                userId: userId || '',
                productId,
                planId,
              },
            }
          : undefined,
    });

    if (!session.url) {
      throw new Error('Failed to generate Stripe checkout URL.');
    }

    return { url: session.url };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed.';
    console.error('[Stripe] Error creating checkout session:', error);
    return { error: errorMessage };
  }
}

/**
 * Creates a Stripe Customer Portal session for subscription management (cancellation, update card)
 */
export async function createCustomerPortalSession(customerId: string, returnPath: string = '/support') {
  const headerList = await headers();
  const origin = headerList.get('origin') || 'https://ayato-studio.ai';

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Stripe secret key not configured.' };
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}${returnPath}`,
    });

    return { url: portalSession.url };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create customer portal session.';
    console.error('[Stripe] Portal error:', error);
    return { error: errorMessage };
  }
}
