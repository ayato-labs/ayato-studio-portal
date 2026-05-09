'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const OFUSE_URL = 'https://ofuse.me/21cfc1d2';

function SupportPageContent() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Developer Note: The "Why" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 px-8 py-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl"
      >
        <div className="flex items-start gap-6">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-blue-500 text-xs font-black uppercase tracking-[0.4em] mb-4">Architect&apos;s Note // Mission & Privacy</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-bold tracking-tight">
              Ayato Studio のポートラル構築にあたり、当初は独自の決済システム（Stripe）の実装を試みました。しかし、個人開発者としてのプライバシー保護と、法的な情報の透明性を両立させる最適な解として、現在はあえて「特定の価格設定」を持たない自由な支援の形を選択しています。<br /><br />
              新卒エンジニアとしての挑戦を、より健全で安全な形で継続するため、現在は外部プラットフォーム（OFUSE）を唯一の支援窓口としています。
            </p>
          </div>
        </div>
      </motion.div>

      {/* Primary Action: OFUSE Support */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative group mb-12"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 rounded-[3rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative p-12 md:p-20 rounded-[3rem] bg-black/40 border border-white/10 backdrop-blur-3xl overflow-hidden text-center">
          
          <div className="max-w-xl mx-auto mb-12">
            <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Support Interface</h3>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              BACK THE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">MISSION</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed tracking-tight">
              OFUSEを通じて、金額に縛られない自由な形でのご支援が可能です。<br />
              一文字1円からのメッセージが、Ayato Studio の継続的なリサーチと開発を支える大きな力となります。
            </p>
          </div>

          <Link
            href={OFUSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-6 px-12 py-7 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-blue-500/20"
          >
            Support via OFUSE
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <div className="mt-12 flex items-center justify-center gap-8 opacity-20 transition-opacity group-hover:opacity-40 duration-700">
             <div className="h-px w-24 bg-white/50" />
             <div className="text-[10px] uppercase font-black tracking-widest text-white">Secure Platform Gateway</div>
             <div className="h-px w-24 bg-white/50" />
          </div>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="text-center text-[8px] uppercase font-black tracking-[0.5em] text-gray-500"
      >
        Archived Prototype: Stripe v1.0 Engine // Suspended for Privacy Protection
      </motion.p>
    </div>
  );
}

export default function SupportPage() {
  return (
    <main className="relative min-h-screen bg-background selection:bg-blue-500/30 overflow-x-hidden py-24 px-6">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[120px] animation-delay-2000 animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400">Support // Mission Progress</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 uppercase leading-[0.9]">
            FUEL THE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500">
              INTELLIGENCE
            </span>
          </h1>
        </motion.div>

        <Suspense fallback={<div className="text-center text-gray-500 py-20 uppercase font-black tracking-widest animate-pulse">Initializing Interface...</div>}>
          <SupportPageContent />
        </Suspense>
      </div>
    </main>
  );
}
