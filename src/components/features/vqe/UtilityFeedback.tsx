"use client";

import { useState, Suspense } from "react";
import { useVQE } from "@/hooks/use-vqe";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";
import { ContentType } from "@/lib/metrics";

interface UtilityFeedbackProps {
  id: string;
  title?: string;
  contentType?: ContentType;
  className?: string;
}

function UtilityFeedbackContent({ id, title = "Unknown", contentType = "Report", className }: UtilityFeedbackProps) {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [efficiencyTracked, setEfficiencyTracked] = useState(false);
  
  const { trackFeedback, trackEfficiency } = useVQE({ 
    id, 
    title, 
    contentType, 
    enabled: false 
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
    <div className={cn("rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 text-center", className)}>
      <h3 className="text-xl font-black tracking-tight mb-2">Was this insight valuable?</h3>
      <p className="text-sm text-gray-500 mb-6 font-medium">Your feedback drives the Ayato Intelligence Engine.</p>
      
      <div className="flex flex-col items-center gap-4">
        {feedback === null ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all font-bold text-sm"
            >
              <Icons.check className="h-4 w-4" />
              Yes, Useful
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-bold text-sm"
            >
              <Icons.close className="h-4 w-4" />
              No
            </button>
          </div>
        ) : feedback === true && !efficiencyTracked ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm font-bold text-blue-400 mb-4">Great! How much research time did this save you?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[15, 30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleEfficiency(mins)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-bold"
                >
                  {mins < 60 ? `${mins}m` : `${mins / 60}h+`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-blue-400 animate-in fade-in zoom-in duration-500 font-bold">
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
