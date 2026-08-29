import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export const metadata = {
  title: 'Terms of Service | Gmail Protector',
  description:
    'Gmail Protector の利用規約。サービスのご利用条件、免責事項、禁止事項について説明します。',
};

export default function GmailProtectorTermsPage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,3,3,1)_100%)]" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/apps/gmail-protector" className="group flex items-center gap-4">
            <div className="flex h-10 w-10 transform items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-xl font-black shadow-lg shadow-blue-500/40 transition-transform group-hover:rotate-6">
              GP
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Gmail Protector</h1>
              <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Legal Center</p>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold tracking-widest text-gray-400 uppercase">
            <Link href="/terms" className="transition-colors hover:text-white">
              Global Terms
            </Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16">
          <Link
            href="/apps/gmail-protector"
            className="mb-8 inline-flex items-center text-xs font-black tracking-widest text-blue-400 uppercase transition-opacity hover:opacity-70"
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to App
          </Link>

          <div className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-blue-500 uppercase">
            <div className="h-px w-12 bg-blue-500/50" />
            App Specific Legal
          </div>
          <h2 className="mb-4 text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
            Terms of Service
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              for Extension
            </span>
          </h2>
          <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
            制定日: 2025年9月25日
          </p>
        </div>

        <div className="space-y-12">
          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl md:p-12">
            <section className="mb-16">
              <h3 className="mb-8 border-b border-white/5 pb-4 text-2xl font-black text-blue-400">
                Googleアカウントデータの利用について
              </h3>
              <p className="mb-8 leading-relaxed text-gray-300">
                Gmail
                Protectorがお客様のGmail環境で動作するために、以下の権限へのアクセス許可をリクエストします。これらの権限は、情報漏洩を防止するという目的のためにのみ、最小限の範囲で使用されます。
              </p>
              <div className="grid gap-6">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold tracking-tighter text-white uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    あなたのメールアドレスの表示 (userinfo.email)
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    <strong>目的:</strong>{' '}
                    拡張機能の画面上に、現在ログインしているアカウントを表示し、どのユーザーとして操作しているかを明確にするために使用します。
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold tracking-tighter text-white uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Google Drive上のファイルの閲覧 (drive.readonly)
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    <strong>目的:</strong>{' '}
                    メールに添付された、または本文中にリンクが記載されたGoogle
                    Drive上のドキュメントやスプレッドシートの内容をスキャンするために必要です。ファイルの編集や削除、新規作成は一切行いません。
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold tracking-tighter text-white uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Googleスプレッドシートの閲覧 (spreadsheets.readonly)
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    <strong>目的:</strong>{' '}
                    企業や組織の管理者が設定した、組織共通のセキュリティ設定（マスター設定ファイル）を安全に読み込むために使用します。シートの編集や削除は一切行いません。
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-16">
              <section>
                <h3 className="mb-6 text-xl font-black text-blue-400">
                  第1条（ベータ版としての提供）
                </h3>
                <div className="space-y-4 leading-relaxed text-gray-300">
                  <p>
                    本サービスは、開発中の先行公開版（ベータ版）として提供されます。利用者は、本サービスが以下の特性を持つ可能性があることを理解し、同意するものとします。
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>評価およびテストを目的としていること。</li>
                    <li>エラー、バグ、不具合、または不正確な情報が含まれる可能性があること。</li>
                    <li>機能は、事前の通知なく追加、変更、または削除されることがあること。</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="mb-6 text-xl font-black text-blue-400">第2条（本規約への同意）</h3>
                <p className="leading-relaxed text-gray-300">
                  1.
                  利用者は、本アプリケーションを自身のChromeブラウザにインストールし、利用を開始した時点で、本規約の全ての記載内容に同意したものとみなされます。
                  <br />
                  2.
                  本規約に同意しない場合、利用者は本アプリケーションを利用することはできません。直ちにインストールを中止するか、アンインストールしてください。
                </p>
              </section>

              <section>
                <h3 className="mb-6 text-xl font-black text-blue-400">
                  第3条（本サービスの目的と機能）
                </h3>
                <p className="leading-relaxed text-gray-300">
                  1. 本アプリケーションは、Google LLCが提供する生成AI「Gemini
                  API」を利用して、利用者がGmailで送信する電子メールの内容に機密情報が含まれるリスクを低減させることを目的とした、現状有姿（as-is）で提供される補助的なツールです。
                  <br />
                  2.
                  本アプリケーションは、情報漏洩を完全に防止することを保証するものではありません。AIによる判定は、その性質上、誤検知または検知漏れを完全に排除することはできません。最終的な送信の判断は、利用者自身の責任で行うものとします。
                  <br />
                  3. 本アプリケーションの利用には、利用者が別途Google LLCとの間でGemini
                  APIの利用契約を締結し、有効なAPIキーを取得・設定する必要があります。
                </p>
              </section>

              <section>
                <h3 className="mb-6 text-xl font-black text-blue-400">
                  第4条（利用者の責任 / BYOKモデル）
                </h3>
                <div className="space-y-4 leading-relaxed text-gray-300">
                  <p>
                    <strong>最終判断の責任:</strong>{' '}
                    送信内容の最終確認・判断責任は全面的に利用者にあります。
                  </p>
                  <p>
                    <strong>APIキーの管理 (BYOKモデル):</strong> 利用者が自身のGemini
                    APIキーを使用して利用する場合、キーの安全な管理および利用料金の支払いは全面的に利用者の責任となります。
                  </p>
                </div>
              </section>

              <section>
                <h3 className="mb-6 text-xl font-black text-blue-400">第5条（禁止事項）</h3>
                <p className="leading-relaxed text-gray-300">
                  利用者は、本アプリケーションの利用にあたり、法令または公序良俗に違反する行為、リバースエンジニアリング、再配布、販売、貸与などの行為を行ってはなりません。
                </p>
              </section>

              <section>
                <h3 className="mb-6 text-xl font-black text-blue-400">第4条（免責事項）</h3>
                <p className="leading-relaxed text-gray-300">
                  1.
                  開発者は、本アプリケーションの利用によって利用者に生じたいかなる損害についても、一切の責任を負いません。
                  <br />
                  2.
                  開発者は、本アプリケーションが全ての利用者の環境で正常に動作することを保証するものではありません。
                </p>
              </section>

              <section className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8">
                <h3 className="mb-6 text-xl font-black text-blue-400">お問い合わせ</h3>
                <p className="mb-4 leading-relaxed text-gray-300">
                  利用規約に関するご質問は、以下のメールアドレスまでお問い合わせください。
                </p>
                <a
                  href="mailto:cwblog69@gmail.com"
                  className="inline-flex items-center gap-2 font-bold text-blue-400 transition-colors hover:text-blue-300"
                >
                  <Icons.mail className="h-5 w-5" />
                  cwblog69@gmail.com
                </a>
              </section>
            </div>
          </div>
        </div>
      </article>

      <footer className="mt-24 border-t border-white/5 bg-black/40 py-12 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          <p>&copy; 2026 Ayato Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Global Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/" className="transition-colors hover:text-white">
              Back to Hub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
