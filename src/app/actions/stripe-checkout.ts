'use server';

import { stripe } from '@/lib/stripe/client';
import { headers } from 'next/headers';

/**
 * Creates a Stripe Checkout Session for Support/Donation
 *
 * @param priceId - The Stripe Price ID for the selected tier (Optional for custom amount, though here we assume fixed prices)
 * @param amount - Optional amount in JPY (if priceId is not used)
 * @param tierName - Name of the support tier
 * @returns { url: string } | { error: string }
 */
export async function createCheckoutSession(params: { amount: number; tierName: string }) {
  const { amount, tierName } = params;
  const headerList = await headers();
  const origin = headerList.get('origin');

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Payment logic is not configured. Please set STRIPE_SECRET_KEY.' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `Support: ${tierName}`,
              description: `Ayato Studio 運営支援 - ${tierName} ティア`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/support?success=true`,
      cancel_url: `${origin}/support?canceled=true`,
      metadata: {
        tier: tierName,
        type: 'donation',
      },
    });

    if (!session.url) {
      throw new Error('Failed to generate session URL.');
    }

    return { url: session.url };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed.';
    console.error('[Stripe] Error creating checkout session:', error);
    return { error: errorMessage };
  }
}
