import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcade - Ayato Studio',
  description: 'エッジ完結で動作する、知的なアーケードゲーム・ライブラリ。',
};

export default function GamesPage() {
  const games = [
    {
      slug: 'zen-matrix',
      title: 'Zen Matrix',
      description: '盤面を自由にエディットできる、究極のブロック配置パズル。',
      color: 'blue',
    },
  ];

  return (
    <main className="min-h-screen bg-background py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-24 flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
              Ayato Studio // Arcade
            </span>
          </div>

          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white md:text-8xl">
            COGNITIVE
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              REFOCUS
            </span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed font-medium text-gray-400 md:text-2xl">
            論理的思考をリセットし、知性を再構築する。
            <br />
            完全エッジ完結型の知的エンターテインメント。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-10 transition-all duration-500 hover:border-blue-500/30 hover:bg-white/[0.04]"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10" />
              
              <span className="mb-6 inline-block text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
                Arcade // Puzzle
              </span>
              <h4 className="mb-4 text-3xl font-black tracking-tight text-white uppercase group-hover:text-blue-400">
                {game.title}
              </h4>
              <p className="mb-8 text-gray-500 font-medium leading-relaxed">
                {game.description}
              </p>
              <div className="flex items-center text-xs font-black tracking-widest text-gray-500 uppercase">
                Play Now <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
