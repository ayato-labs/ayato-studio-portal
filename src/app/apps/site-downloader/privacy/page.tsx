import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export const metadata = {
  title: "Privacy Policy | Ayato Site Downloader",
  description: "Privacy Policy for the Ayato Site Downloader Chrome extension. We respect your privacy and do not collect any user data.",
};

export default function SiteDownloaderPrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-white selection:bg-cyan-500/30 overflow-x-hidden">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,50,100,1)_0%,rgba(5,5,5,1)_100%)]" />

            <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/apps/site-downloader" className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/40 transform group-hover:rotate-6 transition-transform">
                            SD
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold tracking-tight">Site Downloader</h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Documentation Center</p>
                        </div>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm text-gray-400 font-bold uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-white transition-colors">Global Privacy</Link>
                    </nav>
                </div>
            </header>

            <article className="mx-auto max-w-4xl px-6 py-24">
                <div className="mb-16">
                    <Link href="/apps/site-downloader" className="inline-flex items-center text-xs font-black text-cyan-400 uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity">
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back to Docs
                    </Link>
                    
                    <div className="flex items-center gap-3 text-cyan-500 font-bold text-xs uppercase tracking-[0.3em] mb-6">
                        <div className="h-px w-12 bg-cyan-500/50" />
                        App Specific Legal
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-[0.9]">
                        Privacy Policy<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">for Extension</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Last updated: May 1, 2026</p>
                </div>

                <div className="space-y-12">
                    <div className="p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                        <p className="text-xl text-gray-300 leading-relaxed mb-12">
                            Ayato Site Downloader (&quot;the extension&quot;) respects your privacy. This policy explains how the extension handles information.
                        </p>

                        <div className="space-y-16">
                            {/* Section 1 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-cyan-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">01</span>
                                    Data Collection and Use
                                </h3>
                                <div className="space-y-6 text-gray-300 leading-relaxed">
                                    <p className="text-white font-bold text-lg">
                                        Ayato Site Downloader does not collect, store, or transmit any user data.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block mb-1 uppercase text-xs tracking-widest">Local Processing</strong>
                                                The extension operates entirely within your local browser environment.
                                            </div>
                                        </li>
                                        <li className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block mb-1 uppercase text-xs tracking-widest">Webpage Content</strong>
                                                When you choose to download a page, the extension processes the HTML or MHTML content of the current tab locally on your device to create a file. This data is never sent to any external server or third-party service.
                                            </div>
                                        </li>
                                        <li className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block mb-1 uppercase text-xs tracking-widest">No Personal Information</strong>
                                                We do not access or collect personal information, browsing history, or user activity data beyond what is strictly necessary to perform the download function you have explicitly requested.
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-cyan-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">02</span>
                                    Permissions
                                </h3>
                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    <p>
                                        The extension uses the following permissions only for the purpose of downloading the webpage you are currently viewing:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl border border-white/5 bg-black/20">
                                            <code className="text-cyan-400 font-bold block mb-1">activeTab</code>
                                            <p className="text-xs text-gray-500">To identify the webpage you wish to download.</p>
                                        </div>
                                        <div className="p-4 rounded-2xl border border-white/5 bg-black/20">
                                            <code className="text-cyan-400 font-bold block mb-1">scripting</code>
                                            <p className="text-xs text-gray-500">To read the DOM content of the webpage.</p>
                                        </div>
                                        <div className="p-4 rounded-2xl border border-white/5 bg-black/20">
                                            <code className="text-cyan-400 font-bold block mb-1">downloads</code>
                                            <p className="text-xs text-gray-500">To save the generated file to your local computer.</p>
                                        </div>
                                        <div className="p-4 rounded-2xl border border-white/5 bg-black/20">
                                            <code className="text-cyan-400 font-bold block mb-1">pageCapture</code>
                                            <p className="text-xs text-gray-500">To archive the page as an MHTML file.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-cyan-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">03</span>
                                    Third-Party Services
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    This extension does not use any third-party analytics, tracking, or advertising services. No data is shared with any third party.
                                </p>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h3 className="text-2xl font-black mb-6 text-cyan-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">04</span>
                                    Changes to This Policy
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    We may update this Privacy Policy from time to time. Your continued use of the extension constitutes your acceptance of the updated policy.
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section className="p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5">
                                <h3 className="text-2xl font-black mb-6 text-cyan-400 flex items-center gap-3">
                                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">05</span>
                                    Contact
                                </h3>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    If you have any questions about this privacy policy, please contact the developer via the GitHub repository:
                                </p>
                                <a 
                                    href="https://github.com/ayato-labs/html-downloader" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
                                >
                                    <Icons.gitHub className="w-5 h-5" />
                                    ayato-labs/html-downloader
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
