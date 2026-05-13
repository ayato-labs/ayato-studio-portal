import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

export const metadata = {
  title: 'Privacy Policy | Ayato Site Downloader',
  description:
    'Privacy Policy for the Ayato Site Downloader Chrome extension. We respect your privacy and do not collect any user data.',
};

export default function SiteDownloaderPrivacyPage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden text-white selection:bg-cyan-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,50,100,1)_0%,rgba(5,5,5,1)_100%)]" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/apps/site-downloader" className="group flex items-center gap-4">
            <div className="flex h-10 w-10 transform items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-xl font-black shadow-lg shadow-cyan-500/40 transition-transform group-hover:rotate-6">
              SD
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Site Downloader</h1>
              <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
                Documentation Center
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold tracking-widest text-gray-400 uppercase">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Global Privacy
            </Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16">
          <Link
            href="/apps/site-downloader"
            className="mb-8 inline-flex items-center text-xs font-black tracking-widest text-cyan-400 uppercase transition-opacity hover:opacity-70"
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Docs
          </Link>

          <div className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase">
            <div className="h-px w-12 bg-cyan-500/50" />
            App Specific Legal
          </div>
          <h2 className="mb-4 text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
            Privacy Policy
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              for Extension
            </span>
          </h2>
          <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
            Last updated: May 1, 2026
          </p>
        </div>

        <div className="space-y-12">
          <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl md:p-12">
            <p className="mb-12 text-xl leading-relaxed text-gray-300">
              Ayato Site Downloader (&quot;the extension&quot;) respects your privacy. This policy
              explains how the extension handles information.
            </p>

            <div className="space-y-16">
              {/* Section 1 */}
              <section>
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-black text-cyan-400">
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs">
                    01
                  </span>
                  Data Collection and Use
                </h3>
                <div className="space-y-6 leading-relaxed text-gray-300">
                  <p className="text-lg font-bold text-white">
                    Ayato Site Downloader does not collect, store, or transmit any user data.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                      <div>
                        <strong className="mb-1 block text-xs tracking-widest text-white uppercase">
                          Local Processing
                        </strong>
                        The extension operates entirely within your local browser environment.
                      </div>
                    </li>
                    <li className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                      <div>
                        <strong className="mb-1 block text-xs tracking-widest text-white uppercase">
                          Webpage Content
                        </strong>
                        When you choose to download a page, the extension processes the HTML or
                        MHTML content of the current tab locally on your device to create a file.
                        This data is never sent to any external server or third-party service.
                      </div>
                    </li>
                    <li className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                      <div>
                        <strong className="mb-1 block text-xs tracking-widest text-white uppercase">
                          No Personal Information
                        </strong>
                        We do not access or collect personal information, browsing history, or user
                        activity data beyond what is strictly necessary to perform the download
                        function you have explicitly requested.
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-black text-cyan-400">
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs">
                    02
                  </span>
                  Permissions
                </h3>
                <div className="space-y-4 leading-relaxed text-gray-300">
                  <p>
                    The extension uses the following permissions only for the purpose of downloading
                    the webpage you are currently viewing:
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                      <code className="mb-1 block font-bold text-cyan-400">activeTab</code>
                      <p className="text-xs text-gray-500">
                        To identify the webpage you wish to download.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                      <code className="mb-1 block font-bold text-cyan-400">scripting</code>
                      <p className="text-xs text-gray-500">
                        To read the DOM content of the webpage.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                      <code className="mb-1 block font-bold text-cyan-400">downloads</code>
                      <p className="text-xs text-gray-500">
                        To save the generated file to your local computer.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                      <code className="mb-1 block font-bold text-cyan-400">pageCapture</code>
                      <p className="text-xs text-gray-500">To archive the page as an MHTML file.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-black text-cyan-400">
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs">
                    03
                  </span>
                  Third-Party Services
                </h3>
                <p className="leading-relaxed text-gray-300">
                  This extension does not use any third-party analytics, tracking, or advertising
                  services. No data is shared with any third party.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-black text-cyan-400">
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs">
                    04
                  </span>
                  Changes to This Policy
                </h3>
                <p className="leading-relaxed text-gray-300">
                  We may update this Privacy Policy from time to time. Your continued use of the
                  extension constitutes your acceptance of the updated policy.
                </p>
              </section>

              {/* Section 5 */}
              <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8">
                <h3 className="mb-6 flex items-center gap-3 text-2xl font-black text-cyan-400">
                  <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs">
                    05
                  </span>
                  Contact
                </h3>
                <p className="mb-6 leading-relaxed text-gray-300">
                  If you have any questions about this privacy policy, please contact the developer
                  via the GitHub repository:
                </p>
                <a
                  href="https://github.com/ayato-labs/html-downloader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  <Icons.gitHub className="h-5 w-5" />
                  ayato-labs/html-downloader
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
