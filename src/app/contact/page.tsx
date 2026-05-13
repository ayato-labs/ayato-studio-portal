import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | Ayato Studio',
  description:
    'Get in touch with Ayato Studio for custom market analysis, feedback, or general inquiries.',
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,3,3,1)_100%)]" />

      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-16 text-center">
            <div className="mb-8 inline-flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-blue-500 uppercase">
              <div className="h-px w-12 bg-blue-500/50" />
              Communication
            </div>
            <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
              GET IN
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                TOUCH
              </span>
            </h1>
            <p className="mx-auto max-w-sm text-lg leading-relaxed font-medium text-gray-400">
              Any questions, feedback, or custom research inquiries? We&apos;re here to help.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
              <svg
                className="h-32 w-32 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 01-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <h3 className="mb-4 text-xl font-black tracking-widest text-white uppercase">
                Global Support
              </h3>
              <p className="mb-8 text-3xl font-black tracking-tighter text-blue-400 select-all md:text-4xl">
                Cwblog69@gmail.com
              </p>
              <div className="mx-auto mb-8 h-px w-24 bg-white/10" />
              <p className="text-sm leading-relaxed font-medium text-gray-500">
                通常、24時間以内に専門スタッフが返信いたします。
                <br />
                緊急度の高い調査依頼については、件名に「URGENT」とご記入ください。
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/"
              className="text-xs font-black tracking-[0.2em] text-gray-600 uppercase underline decoration-blue-500/30 underline-offset-8 transition-colors hover:text-white"
            >
              Back to Portal Hub
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
