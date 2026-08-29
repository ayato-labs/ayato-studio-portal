'use client';

import { useState } from 'react';
import { createCheckoutSession } from '@/app/actions/stripe-checkout';

interface CheckoutButtonProps {
  productId: string;
  planId: string;
  tierName: string;
  amount: number;
  mode?: 'subscription' | 'payment';
  buttonText?: string;
  className?: string;
}

export function CheckoutButton({
  productId,
  planId,
  tierName,
  amount,
  mode = 'subscription',
  buttonText = '今すぐ申し込む',
  className = 'w-full py-4 px-6 rounded-full font-bold text-center transition-all duration-300',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (amount === 0) {
      window.location.href = `https://github.com/ayato-labs`;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createCheckoutSession({
        productId,
        planId,
        tierName,
        amount,
        mode,
        successPath: `/support?session_id={CHECKOUT_SESSION_ID}&product=${productId}&plan=${planId}&success=true`,
        cancelPath: `/services/${productId}?canceled=true`,
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      setError(err?.message || '決済処理の開始に失敗しました。');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${className} ${
          loading ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {loading ? '決済ページへ移動中...' : buttonText}
      </button>
      {error && <p className="mt-2 text-xs text-red-400 text-center font-medium">{error}</p>}
    </div>
  );
}
