'use client';

import { useState, Suspense } from 'react';
import { useVQE } from '@/hooks/use-vqe';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { ContentType } from '@/lib/metrics';

interface UtilityFeedbackProps {
  id: string;
  title?: string;
  contentType?: ContentType;
  className?: string;
}

function UtilityFeedbackContent({
  id,
  title = 'Unknown',
  contentType = 'Report',
  className,
}: UtilityFeedbackProps) {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [efficiencyTracked, setEfficiencyTracked] = useState(false);

  const { trackFeedback, trackEfficiency } = useVQE({
    id,
    title,
    contentType,
    enabled: false,
  });

  const handleFeedback = (isUseful: boolean) => {
    if (feedback !== null) return;
    setFeedback(isUseful);
    trackFeedback(isUseful);
  };

  const handleEfficiency = (minutes: number) => {
    trackEfficiency(minutes);
    setEfficiencyTracked(true);
  };

  return (
    <div
      className={cn(
        'rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-xl',
        className,
      )}
    >
      <h3 className="mb-2 text-xl font-black tracking-tight">Was this insight valuable?</h3>
      <p className="mb-6 text-sm font-medium text-gray-500">
        Your feedback drives the Ayato Intelligence Engine.
      </p>

      <div className="flex flex-col items-center gap-4">
        {feedback === null ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-6 py-3 text-sm font-bold text-blue-400 transition-all hover:bg-blue-500/20"
            >
              <Icons.check className="h-4 w-4" />
              Yes, Useful
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/20"
            >
              <Icons.close className="h-4 w-4" />
              No
            </button>
          </div>
        ) : feedback === true && !efficiencyTracked ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="mb-4 text-sm font-bold text-blue-400">
              Great! How much research time did this save you?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[15, 30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleEfficiency(mins)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold transition-all hover:bg-white/10"
                >
                  {mins < 60 ? `${mins}m` : `${mins / 60}h+`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in flex items-center gap-2 font-bold text-blue-400 duration-500">
            <Icons.check className="h-5 w-5" />
            Thank you for helping us quantify value.
          </div>
        )}
      </div>
    </div>
  );
}

export function UtilityFeedback(props: UtilityFeedbackProps) {
  return (
    <Suspense fallback={null}>
      <UtilityFeedbackContent {...props} />
    </Suspense>
  );
}
