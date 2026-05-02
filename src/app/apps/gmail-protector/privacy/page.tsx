import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export const metadata = {
  title: "Privacy Policy | Gmail Protector",
  description: "Gmail Protector のプライバシーポリシー。ユーザーの機密情報保護とデータの取り扱いについて説明します。",
};

export default function GmailProtectorPrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-white selection:bg-blue-500/30 overflow-x-hidden">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,3,3,1)_100%)]" />

            <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/apps/gmail-protector" className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/40 transform group-hover:rotate-6 transition-transform">
                            GP
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold tracking-tight">Gmail Protector</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Security Center</p>
                        </div>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm text-gray-400 font-bold uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-white transition-colors">Global Privacy</Link>
                    </nav>
                </div>
            </header>

            <article className="mx-auto max-w-4xl px-6 py-24">
                <div className="mb-16">
                    <Link href="/apps/gmail-protector" className="inline-flex items-center text-xs font-black text-blue-400 uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity">
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back to App
                    </Link>
                    
                    <div className="flex items-center gap-3 text-blue-500 font-bold text-xs uppercase tracking-[0.3em] mb-6">
                        <div className="h-px w-12 bg-blue-500/50" />
                        Legal Documentation
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-[0.9]">
                        Privacy Policy<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">for Extension</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">最終更新日: 2026年5月2日</p>
                </div>

                <div className="space-y-12">
                    <div className="p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                        <p className="text-xl text-gray-300 leading-relaxed mb-12">
                            本プライバシーポリシーは、Chrome拡張機能「Gmail Protector」（以下「本拡張機能」）が、どのようにユーザーの情報を収集、使用、開示するかを説明するものです。
                        </p>

                        <div className="space-y-16">
                            {/* Section 1 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">01</span>
                                    収集する情報
                                </h3>
                                <div className="space-y-6 text-gray-300 leading-relaxed">
                                    <p>本拡張機能は、ユーザーのGmail送信時の機密情報保護を目的として以下の情報を処理します。</p>
                                    <ul className="space-y-4">
                                        <li className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block mb-1 uppercase text-xs tracking-widest">メールコンテンツ</strong>
                                                送信前のメール本文および添付ファイルの内容。これらはAI（Gemini API）によるセキュリティチェックのためにのみ一時的に使用されます。
                                            </div>
                                        </li>
                                        <li className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block mb-1 uppercase text-xs tracking-widest">Google Drive データ</strong>
                                                ユーザーが添付したGoogle Drive上のドキュメント、スプレッドシート、スライドのメタデータおよびテキスト内容。
                                            </div>
                                        </li>
                                        <li className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block mb-1 uppercase text-xs tracking-widest">認証情報</strong>
                                                Google APIへのアクセスに必要なOAuthトークン（ユーザーによる許可が必要です）。
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">02</span>
                                    情報の利用目的
                                </h3>
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>収集した情報は、以下の目的のみに使用されます。</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>送信内容のセキュリティ分析（機密情報の検出）。</li>
                                        <li>セキュリティ上のリスクがある場合のユーザーへの警告表示。</li>
                                        <li>AIモデルによる解析の実行（Gemini API の利用）。</li>
                                    </ul>
                                    <div className="mt-6 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-sm italic text-gray-400">
                                        ※AIモデルによる解析を行うため、メール本文や添付ファイルの内容はGemini APIを運営するGoogleのサーバーへ送信されます。ユーザーのセキュリティを担保するため、機密情報を取り扱う際はGemini APIのデータ保護ポリシーに準拠したAPI環境でのご利用を強く推奨します。
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">03</span>
                                    情報の共有と保護
                                </h3>
                                <ul className="space-y-4 text-gray-300 leading-relaxed">
                                    <li>- 本拡張機能は、ユーザーの機密情報を第三者に販売・提供することは一切ありません。</li>
                                    <li>- Gemini APIへ送信されるデータは、Gemini APIのサービス利用規約に従って保護されます。</li>
                                    <li>- ユーザーの認証トークンは、拡張機能内で安全に管理され、API呼び出し以外の目的には使用されません。</li>
                                </ul>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">04</span>
                                    ユーザーのコントロール
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    ユーザーは、いつでも拡張機能の設定画面からGemini APIキーの削除や、Google Driveへのアクセス許可の取り消しを行うことができます。
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">05</span>
                                    データの保存場所と管理（エッジ完結型）
                                </h3>
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>本拡張機能は、<strong>エッジ完結型アーキテクチャ</strong>を採用しています。ユーザーの機密情報（Gemini APIキー、機密情報リストなど）は、<strong>ユーザー自身のブラウザ（ローカルストレージ）内にのみ</strong>保存されます。</p>
                                    <p>
                                        <strong>情報の非保持:</strong> 本拡張機能は、ユーザーの許可なしに、独自に運営するサーバーへデータを送信・保存することはありません。AI解析のために必要な通信は、ユーザーが入力したAPIキーを用いて直接Google APIサーバーと行われます。
                                    </p>
                                    <p>
                                        <strong>削除手順:</strong> 設定画面の「全てのリセット」ボタンにより、ブラウザ上の全データが即座に削除されます。
                                    </p>
                                </div>
                            </section>

                            {/* Contact */}
                            <section className="p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5">
                                <h3 className="text-2xl font-black mb-6 text-blue-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">06</span>
                                    お問い合わせ
                                </h3>
                                <p className="text-gray-300 leading-relaxed mb-4">
                                    本ポリシーに関するご質問は、以下のメールアドレスまでお問い合わせください。
                                </p>
                                <a 
                                    href="mailto:syukatu.cw@gmail.com" 
                                    className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
                                >
                                    <Icons.mail className="w-5 h-5" />
                                    syukatu.cw@gmail.com
                                </a>
                            </section>
                        </div>
                    </div>
                </div>
            </article>

            <footer className="mt-24 border-t border-white/5 py-12 bg-black/40 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6 flex justify-between items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <p>&copy; 2026 Ayato Studio. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Global Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/" className="hover:text-white transition-colors">Back to Hub</Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
