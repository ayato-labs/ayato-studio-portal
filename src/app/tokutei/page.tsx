import React from 'react';
import Link from 'next/link';

export default function TokuteiPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)]" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-4">
            <div className="flex h-10 w-10 transform items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-xl font-black shadow-lg shadow-blue-500/40 transition-transform group-hover:rotate-6">
              A
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Ayato Studio</h1>
              <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Back to Portal</p>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-blue-500 uppercase">
            <div className="h-px w-12 bg-blue-500/50" />
            Legal / Compliance
          </div>
          <h2 className="mb-4 text-5xl leading-[0.9] font-black tracking-tighter md:text-6xl">
            特定商取引法に基づく表記
          </h2>
          <p className="text-sm text-gray-500">最終更新日: 2026年2月28日</p>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <tr className="border-b border-white/5">
                  <th className="w-1/3 bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    販売業者
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">Ayato Studio (運営者: )</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    代表責任者
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    [代表者名をご記入ください]
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    所在地
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">[住所をご記入ください]</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    電話番号
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    [電話番号をご記入ください]
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    メールアドレス
                  </th>
                  <td className="p-8 font-medium text-blue-400 md:p-10">Cwblog69@gmail.com</td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    販売価格
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    各プランの紹介ページ（料金プラン）をご参照ください。表示価格は消費税込みの価格です。
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    商品代金以外の必要料金
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    インターネット接続料金その他の電気通信回線の通信に関する費用（お客様のご負担となります）。
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    引き渡し時期
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    お支払い手続き完了後、直ちにご利用いただけます。
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    お支払方法
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    外部プラットフォーム（OFUSE等）を介した決済、または当社が別途指定する方法。なお、現在はStripeによる直接販売は停止しており、プラットフォームの規約に準じます。
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    提供開始後のキャンセル・返品
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    デジタルコンテンツおよび寄付の性質上、決済完了後の返品・キャンセルはお受けできません。各プラットフォームのポリシーに従ってください。
                  </td>
                </tr>
                <tr>
                  <th className="bg-white/[0.01] p-8 text-[10px] font-black tracking-widest text-gray-400 uppercase md:p-10">
                    動作環境
                  </th>
                  <td className="p-8 font-medium text-gray-200 md:p-10">
                    最新のWebブラウザ（Chrome, Firefox, Safari, Edge等）の動作要件に準じます。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-blue-500/20 bg-blue-500/5 p-8 md:p-10">
          <p className="text-sm leading-relaxed text-gray-400">
            ※現在、Ayato Studio
            では個人開発におけるプライバシー保護の観点から、直接の販売を行わず、外部プラットフォーム（OFUSE）を主要な支援窓口としています。
            <br />
            直接販売の再開時には、法的に求められる情報を適切に公開いたします。
          </p>
        </div>
      </article>

      <footer className="mt-24 border-t border-white/5 bg-black/40 py-12 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-gray-500">
          <p>&copy; 2026 Ayato Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <span className="font-bold text-white">特定商取引法に基づく表記</span>
            <Link href="/" className="hover:text-white">
              Back to Hub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
