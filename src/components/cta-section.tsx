"use client";

import React from "react";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  className?: string;
  theme?: "blue" | "indigo" | "cyan";
}

export function CTASection({ className, theme = "blue" }: CTASectionProps) {
  const themeStyles = {
    blue: {
      accent: "bg-blue-500",
      tag: "bg-blue-500/10 text-blue-400",
      ping: "bg-blue-400",
      dot: "bg-blue-500",
      button: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
    },
    indigo: {
      accent: "bg-indigo-500",
      tag: "bg-indigo-500/10 text-indigo-400",
      ping: "bg-indigo-400",
      dot: "bg-indigo-500",
      button: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
    },
    cyan: {
      accent: "bg-cyan-500",
      tag: "bg-cyan-500/10 text-cyan-400",
      ping: "bg-cyan-400",
      dot: "bg-cyan-500",
      button: "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20"
    }
  };

  const styles = themeStyles[theme];
  
  return (
    <section className={cn("mt-24 relative overflow-hidden", className)}>
      {/* Background Accent */}
      <div className={cn(
        "absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 rounded-full",
        styles.accent
      )} />
      
      <div className="relative p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6",
              styles.tag
            )}>
              <span className="relative flex h-2 w-2">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", styles.ping)}></span>
                <span className={cn("relative inline-flex rounded-full h-2 w-2", styles.dot)}></span>
              </span>
              Ayato Studio Business Support
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              AI導入や技術課題でお悩みですか？
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Ayato Studioでは、カスタムAIエージェントの開発やデータ解析の支援を行っています。
              クラウドワークスまたはメールにて、まずはお気軽にご相談ください。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://crowdworks.jp/public/employees/6435014" 
              target="_blank" 
              rel="noopener noreferrer"
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
              className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-widest bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              メールで問い合わせ
              <Icons.mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
