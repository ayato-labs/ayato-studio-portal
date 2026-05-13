'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const OFUSE_URL = 'https://ofuse.me/21cfc1d2';

function SupportPageContent() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Developer Note: The "Why" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 rounded-[2.5rem] border border-white/5 bg-white/[0.02] px-8 py-10 backdrop-blur-xl"
      >
        <div className="flex items-start gap-6">
          <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-black tracking-[0.4em] text-blue-500 uppercase">
              Architect&apos;s Note // Mission & Privacy
            </h4>
            <p className="text-sm leading-relaxed font-bold tracking-tight text-gray-400">
              Ayato Studio
              のポートラル構築にあたり、当初は独自の決済システム（Stripe）の実装を試みました。しかし、個人開発者としてのプライバシー保護と、法的な情報の透明性を両立させる最適な解として、現在はあえて「特定の価格設定」を持たない自由な支援の形を選択しています。
              <br />
              <br />
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
        className="group relative mb-12"
      >
        <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 opacity-25 blur transition duration-1000 group-hover:opacity-60 group-hover:duration-200"></div>
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-black/40 p-12 text-center backdrop-blur-3xl md:p-20">
          <div className="mx-auto mb-12 max-w-xl">
            <h3 className="mb-6 text-[10px] font-black tracking-[0.5em] text-blue-500 uppercase">
              Support Interface
            </h3>
            <h2 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-7xl">
              BACK THE
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                MISSION
              </span>
            </h2>
            <p className="text-lg leading-relaxed font-medium tracking-tight text-gray-400">
              OFUSEを通じて、金額に縛られない自由な形でのご支援が可能です。
              <br />
              一文字1円からのメッセージが、Ayato Studio
              の継続的なリサーチと開発を支える大きな力となります。
            </p>
          </div>

          <Link
            href={OFUSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-6 rounded-full bg-white px-12 py-7 text-xs font-black tracking-[0.3em] text-black uppercase shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Support via OFUSE
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>

          <div className="mt-12 flex items-center justify-center gap-8 opacity-20 transition-opacity duration-700 group-hover:opacity-40">
            <div className="h-px w-24 bg-white/50" />
            <div className="text-[10px] font-black tracking-widest text-white uppercase">
              Secure Platform Gateway
            </div>
            <div className="h-px w-24 bg-white/50" />
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="text-center text-[8px] font-black tracking-[0.5em] text-gray-500 uppercase"
      >
        Archived Prototype: Stripe v1.0 Engine // Suspended for Privacy Protection
      </motion.p>
    </div>
  );
}

export default function SupportPage() {
  return (
    <main className="bg-background relative min-h-screen overflow-x-hidden px-6 py-24 selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-[40%] w-[40%] animate-pulse rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="animation-delay-2000 absolute bottom-[10%] left-[-5%] h-[35%] w-[35%] animate-pulse rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">
              Support // Mission Progress
            </span>
          </div>

          <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-8xl">
            FUEL THE
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
              INTELLIGENCE
            </span>
          </h1>
        </motion.div>

        <Suspense
          fallback={
            <div className="animate-pulse py-20 text-center font-black tracking-widest text-gray-500 uppercase">
              Initializing Interface...
            </div>
          }
        >
          <SupportPageContent />
        </Suspense>
      </div>
    </main>
  );
}
