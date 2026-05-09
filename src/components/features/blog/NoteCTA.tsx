"use client";

import React, { Suspense } from 'react';
import { useVQE } from '@/hooks/use-vqe';

interface NoteCTAProps {
    title?: string;
    link?: string;
}

const NoteCTAContent = ({ 
    title = "Premium AI Implementation Guide", 
    link = "https://note.com/ayato_studio" 
}: NoteCTAProps) => {
    const { trackLead } = useVQE({ id: link, title, contentType: "Asset", enabled: false });

    return (
        <div className="my-16 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 backdrop-blur-3xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest">Premium</span>
                        <span className="text-amber-500/60 text-[10px] font-bold uppercase tracking-widest">Engineering Asset</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4 group-hover:text-amber-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xl">
                        AIによる自律的な意思決定と自動化を実現するための、具体的なプロンプト・コード・設計図。
                        Ayato Studio の開発現場で磨き上げられた実戦的な知見を note で公開しています。
                    </p>
                </div>
                
                <a 
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLead("NoteCTA", "note.com")}
                    className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all hover:scale-[1.05] shadow-xl shadow-amber-500/20"
                >
                    noteで技術詳細を見る
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export const NoteCTA = (props: NoteCTAProps) => {
    return (
        <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-white/5 rounded-[2.5rem] my-16" />}>
            <NoteCTAContent {...props} />
        </Suspense>
    );
};
