"use client";

import React, { Suspense } from "react";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";
import { useVQE } from "@/hooks/use-vqe";

interface CTASectionProps {
  className?: string;
  theme?: "blue" | "indigo" | "amber";
}

const CTASectionContent = ({ className, theme = "blue" }: CTASectionProps) => {
  const { trackLead } = useVQE({ id: "cta-section", title: "Global CTA", contentType: "App", enabled: false });

  const themes = {
    blue: {
      bg: "bg-blue-600/5",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      button: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
    },
    indigo: {
      bg: "bg-indigo-600/5",
      border: "border-indigo-500/20",
      accent: "text-indigo-400",
      button: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
    },
    amber: {
      bg: "bg-amber-600/5",
      border: "border-amber-500/20",
      accent: "text-amber-400",
      button: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20"
    }
  };

  const styles = themes[theme] || themes.blue;

  return (
    <div className={cn("relative overflow-hidden rounded-[3rem] border p-8 md:p-16", styles.bg, styles.border, className)}>
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      
      <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400/80">Available for Consultation</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-none">
            READY TO<br />
            <span className={styles.accent}>QUANTIFY VALUE?</span>
          </h2>
          <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-md">
            AIを活用したリサーチの自動化、価値計測エンジンの導入、
            次世代の技術スタック構築など、ビジネスの加速を支援します。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://crowdworks.jp/public/employees/6435014" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackLead("CTASection", "CrowdWorks")}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl",
                styles.button
              )}
            >
              CrowdWorksで相談
              <Icons.externalLink className="w-4 h-4" />
            </a>
            
            <a 
              href="mailto:Cwblog69@gmail.com" 
              onClick={() => trackLead("CTASection", "Contact")}
              className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-widest bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              メールで問い合わせ
              <Icons.mail className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-2xl">
            <div className="space-y-6">
              {[
                { label: "Architecture", value: "Modern & Clean" },
                { label: "Lead Time", value: "2-4 Weeks" },
                { label: "Engine", value: "AI-Augmented" }
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.label}</span>
                  <span className="text-sm font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CTASection = (props: CTASectionProps) => {
  return (
    <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-white/5 rounded-[3rem]" />}>
      <CTASectionContent {...props} />
    </Suspense>
  );
};
