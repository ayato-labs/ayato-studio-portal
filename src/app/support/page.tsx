'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const OFUSE_URL = 'https://ofuse.me/21cfc1d2';

function SupportPageContent() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* The Philosophy of Independence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 rounded-[2.5rem] border border-white/5 bg-white/[0.02] px-8 py-12 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
          <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-black tracking-[0.4em] text-blue-500 uppercase">
              The Philosophy // Independence of Intelligence
            </h4>
            <p className="text-base leading-relaxed font-bold tracking-tight text-gray-300">
              Ayato Studio は、既存の金融資本や広告モデルから完全に独立した存在です。
              私たちが大手決済プラットフォームによるユーザー追跡や、画一的な定期購読モデルをあえて採用しないのは、
              情報の「受け手」を管理・分析する従来のデータビジネス構造から決別するためです。
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              私たちの知性は、広告主ではなく、あなたに向いています。
              ここでの支援は、単なる寄付ではありません。それは、マーケットの深層にある「バイアスのない真実」を維持し、
              プライバシーが究極まで守られた新しい情報の形を共に作り上げるための、共同投資です。
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
        <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 opacity-20 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-black/40 p-12 text-center backdrop-blur-3xl md:p-20">
          <div className="mx-auto mb-12 max-w-xl">
            <h3 className="mb-6 text-[10px] font-black tracking-[0.5em] text-blue-500 uppercase">
              Patronage Gateway
            </h3>
            <h2 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-7xl">
              PROTECT THE
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                UNBIASED
              </span>
            </h2>
            <p className="text-lg leading-relaxed font-medium tracking-tight text-gray-400">
              OFUSE を通じて、独立系リサーチの継続をご支援いただけます。
              <br />
              一文字 1 円からのメッセージが、Ayato Studio の「独立性」を維持する最も純粋なエネルギーとなります。
            </p>
          </div>

          <Link
            href={OFUSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-6 rounded-full bg-white px-12 py-7 text-xs font-black tracking-[0.3em] text-black uppercase shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Become a Patron via OFUSE
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
              Privacy-First Platform
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
        Independent Intelligence Engine // Powered by your trust
      </motion.p>
    </div>
  );
}
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
