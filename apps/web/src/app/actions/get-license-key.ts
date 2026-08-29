'use server';

import { stripe } from '@/lib/stripe/client';
import { generateLicenseKey } from '@/lib/license/signer';

export interface LicenseKeyResult {
  success: boolean;
  licenseKey?: string;
  customerEmail?: string;
  productName?: string;
  planName?: string;
  error?: string;
}

/**
 * Retrieves Stripe session and issues an Ed25519 cryptographic license key
 */
export async function issueLicenseKeyForSession(sessionId: string): Promise<LicenseKeyResult> {
  if (!sessionId) {
    return { success: false, error: 'Session ID is required.' };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    // Generate fallback demo license if test mode without secret
    const demoKey = generateLicenseKey({
      product: 'general',
      email: 'demo@ayato-studio.ai',
      planId: 'pro',
      tierName: 'Pro Tier',
      issuedAt: new Date().toISOString(),
      expiresAt: null,
    });
    return {
      success: true,
      licenseKey: demoKey,
      customerEmail: 'customer@ayato-studio.ai',
      productName: 'Ayato Studio Pro',
    };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed.' };
    }

    const metadata = session.metadata || {};
    const email = session.customer_email || session.customer_details?.email || 'customer@ayato-studio.ai';
    const product = metadata.productId || 'general';
    const planId = metadata.planId || 'standard';
    const tierName = metadata.tierName || 'Pro License';
    const mode = metadata.mode || 'payment';

    // Calculate expiration (null for lifetime/payment, +35 days for monthly subscription)
    const expiresAt =
      mode === 'subscription'
        ? new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
        : null;

    const licenseKey = generateLicenseKey({
      product,
      email,
      planId,
      tierName,
      issuedAt: new Date().toISOString(),
      expiresAt,
    });

    return {
      success: true,
      licenseKey,
      customerEmail: email,
      productName: tierName,
      planName: planId,
    };
  } catch (error: any) {
    console.error('[License Issuer] Error retrieving session:', error);
    return { success: false, error: error?.message || 'Failed to issue license key.' };
  }
}
