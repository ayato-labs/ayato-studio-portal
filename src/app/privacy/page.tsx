import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-blue-500 uppercase">
            <div className="h-px w-12 bg-blue-500/50" />
            Legal
          </div>
          <h2 className="mb-4 text-5xl leading-[0.9] font-black tracking-tighter md:text-6xl">
            Privacy Policy
          </h2>
          <p className="text-sm text-gray-500">最終更新日: 2026年2月27日</p>
        </div>

        <div className="space-y-16">
          {/* Section 1 */}
          <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl md:p-10">
            <h3 className="mb-6 text-2xl font-black text-blue-400">第1条 - 個人情報の収集</h3>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>
                本サービスでは、ユーザーの利便性向上およびサービス改善のために、
                以下の情報を収集する場合があります。
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>
                  - アクセス解析データ（IPアドレス、ブラウザの種類、参照元URL、アクセス日時等）
                </li>
                <li>- Cookie により収集される情報</li>
                <li>- ユーザーが任意で提供するメールアドレス等の情報（アカウント登録時）</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl md:p-10">
            <h3 className="mb-6 text-2xl font-black text-blue-400">第2条 - 個人情報の利用目的</h3>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>収集した個人情報は、以下の目的にのみ使用します。</p>
              <ul className="space-y-2">
                <li>- 本サービスの提供・運営・改善</li>
                <li>- ユーザーからのお問い合わせへの対応</li>
                <li>- 利用状況の分析・統計処理</li>
                <li>- 広告の配信およびその効果測定</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl md:p-10">
            <h3 className="mb-6 text-2xl font-black text-blue-400">
              第3条 - Cookie の使用について
            </h3>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>
                本サービスでは、ユーザー体験の向上および広告配信のために Cookie を使用しています。
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
                  <p className="mb-2 font-bold text-white">Google Analytics 4</p>
                  <p className="text-sm text-gray-400">
                    アクセス解析ツールです。Cookieを使用してデータを収集します。詳細は
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                      プライバシーポリシー
                    </a>
                    をご確認ください。
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
                  <p className="mb-2 font-bold text-white">Google AdSense</p>
                  <p className="text-sm text-gray-400">
                    Google などの第三者配信事業者が Cookie を使用して、ユーザーが当サイトや他のサイトに過去にアクセスした際の情報に基づいて広告を配信します。
                    ユーザーは、
                    <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">
                      広告設定
                    </a>
                    からパーソナライズ広告を無効にできます。
                  </p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
                  <p className="mb-2 font-bold text-white">Google Ads</p>
                  <p className="text-sm text-gray-400">
                    広告効果測定ツールです。コンバージョン測定等のためにCookieを使用します。
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                ユーザーはブラウザの設定により Cookie の受け入れを拒否することが可能ですが、
                その場合、本サービスの一部機能が利用できなくなる可能性があります。
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl md:p-10">
            <h3 className="mb-6 text-2xl font-black text-blue-400">第4条 - 第三者への情報提供</h3>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>
                運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
              </p>
              <ul className="space-y-2">
                <li>- ユーザー本人の同意がある場合</li>
                <li>- 法令に基づく場合</li>
                <li>- 人の生命、身体または財産の保護のために必要な場合</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl md:p-10">
            <h3 className="mb-6 text-2xl font-black text-blue-400">
              第5条 - プライバシーポリシーの変更
            </h3>
            <div className="space-y-4 leading-relaxed text-gray-300">
              <p>
                運営者は、必要に応じて本ポリシーを変更することがあります。
                変更後のプライバシーポリシーは、本ページに掲載された時点で効力を生じるものとします。
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-[2rem] border border-blue-500/20 bg-blue-500/5 p-8 md:p-10">
            <h3 className="mb-6 text-2xl font-black text-blue-400">お問い合わせ</h3>
            <p className="leading-relaxed text-gray-300">
              本ポリシーに関するお問い合わせは、以下よりご連絡ください。
            </p>
            <p className="mt-4 font-bold text-blue-400">Email: Cwblog69@gmail.com</p>
          </section>
        </div>
      </article>

      <footer className="mt-24 border-t border-white/5 bg-black/40 py-12 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs text-gray-500">
          <p>&copy; 2026 Ayato Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="font-bold text-white">Privacy Policy</span>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/tokutei" className="hover:text-white">
              特定商取引法に基づく表記
            </Link>
            <Link href="/" className="hover:text-white">
              Back to Hub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
