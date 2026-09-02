'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { issueLicenseKeyForSession } from '@/app/actions/get-license-key';

const OFUSE_URL = 'https://ofuse.me/21cfc1d2';

// Product Download & Setup Catalog
const DOWNLOAD_RESOURCES: Record<
  string,
  {
    title: string;
    description: string;
    version: string;
    downloads: { label: string; url: string; badge: string; isPrimary?: boolean }[];
    setupGuide: string[];
  }
> = {
  'movie-to-text': {
    title: 'Transform_MovieToText (Pro / Lifetime Edition)',
    description: '完全オフライン・エアギャップ保証のAI文字起こし＆話者分離エンジン',
    version: 'v1.1.0 (Windows 64bit)',
    downloads: [
      {
        label: 'Windows スタンドアロン版 (EXE 同梱 ZIP / 64-bit)',
        url: 'https://pub-6635a59174424912830591c4b4a000be.r2.dev/TransformMovieToText-Windows-v1.1.0-Standalone.zip',
        badge: 'Direct Download',
        isPrimary: true,
      },
      {
        label: 'ソースコード (GitHub リポジトリ)',
        url: 'https://github.com/ayato-labs/Transform_MovieToText',
        badge: 'GitHub',
      },
    ],
    setupGuide: [
      'ダウンロードした ZIP ファイルを展開します。',
      '展開先フォルダ内の setup.bat または 実行ファイル を起動します。',
      '音声・動画ファイルをドラッグ＆ドロップすると、0バイト外部送信の安全なローカル文字起こしが開始されます。',
    ],
  },
  'project-code-map': {
    title: 'ProjectCodeMap (Pro Edition)',
    description: 'ASTベースのコードベース・コンテキスト圧縮＆最適化エンジン',
    version: 'v1.4.0 (Multi-platform CLI & Web)',
    downloads: [
      {
        label: 'CLI ワンライナー実行 (uvx)',
        url: 'https://github.com/ayato-labs/ayato-studio',
        badge: 'Instant CLI',
        isPrimary: true,
      },
    ],
    setupGuide: [
      'ターミナルで `uvx project-code-map --format xml > context.xml` を実行します。',
      '生成された XML シグネチャを Cursor や Claude のプロンプトに添付することで、85%のトークン削減が完了します。',
    ],
  },
  'tenk-orbit': {
    title: 'TenKOrbit (Pro / Lifetime Edition)',
    description: '1万時間の法則 × 手書きノートOCR＆ローカルAI伴走指導アプリ',
    version: 'v1.0.0 (Desktop & Android APK)',
    downloads: [
      {
        label: 'Android ネイティブアプリ (APK)',
        url: 'https://github.com/ayato-labs/TenKOrbit/releases',
        badge: 'Android APK',
        isPrimary: true,
      },
      {
        label: 'Windows / Mac デスクトップ版 (ZIP)',
        url: 'https://github.com/ayato-labs/TenKOrbit/releases',
        badge: 'Desktop App',
      },
    ],
    setupGuide: [
      'Android端末で APK をダウンロードし、インストールします（「提供元不明のアプリ」を許可）。',
      'アプリを起動し、目標とする夢（1万時間）と資格マイルストーンを設定します。',
      '日々の学習終了後にノートの写真を撮影すると、AIが即座に理解度と質の評価アドバイスを出力します。',
    ],
  },
};

function PurchaseSuccessHub({ productId, sessionId }: { productId: string; sessionId: string }) {
  const resource = DOWNLOAD_RESOURCES[productId] || DOWNLOAD_RESOURCES['movie-to-text'];
  const [licenseInfo, setLicenseInfo] = useState<{ key?: string; loading: boolean; copied: boolean }>({
    loading: true,
    copied: false,
  });

  useEffect(() => {
    async function loadLicense() {
      if (!sessionId) {
        setLicenseInfo({ loading: false, copied: false });
        return;
      }
      const res = await issueLicenseKeyForSession(sessionId);
      if (res.success && res.licenseKey) {
        setLicenseInfo({ key: res.licenseKey, loading: false, copied: false });
      } else {
        setLicenseInfo({ loading: false, copied: false });
      }
    }
    loadLicense();
  }, [sessionId]);

  const handleCopy = () => {
    if (licenseInfo.key) {
      navigator.clipboard.writeText(licenseInfo.key);
      setLicenseInfo((prev) => ({ ...prev, copied: true }));
      setTimeout(() => setLicenseInfo((prev) => ({ ...prev, copied: false })), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-950/20 p-8 backdrop-blur-2xl md:p-12"
    >
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-emerald-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xs font-black tracking-widest uppercase">Payment Verified // License Active</span>
      </div>

      <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">{resource.title}</h2>
      <p className="mb-8 text-base text-gray-300">{resource.description}</p>

      {/* Cryptographic Offline License Key Box */}
      {licenseInfo.key && (
        <div className="mb-10 rounded-3xl border border-emerald-500/30 bg-black/60 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
              Your Offline Ed25519 License Key (0-Byte Verification)
            </span>
            <button
              onClick={handleCopy}
              className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/30"
            >
              {licenseInfo.copied ? 'コピー完了！' : 'キーをコピー'}
            </button>
          </div>
          <p className="font-mono text-xs text-gray-300 break-all bg-white/5 p-3 rounded-xl select-all">
            {licenseInfo.key}
          </p>
          <p className="mt-2 text-[11px] text-gray-400">
            ※ アプリの設定画面にこのキーを貼り付けると、完全オフラインで Pro 機能が即座にアンロックされます。
          </p>
        </div>
      )}

      {/* Download Action Cards */}
      <div className="mb-10 grid gap-4 md:grid-cols-2">
        {resource.downloads.map((dl, idx) => (
          <Link
            key={idx}
            href={dl.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between rounded-2xl p-6 transition-all duration-300 ${
              dl.isPrimary
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02]'
                : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase opacity-75">{dl.badge}</span>
              <h4 className="mt-1 text-base font-bold">{dl.label}</h4>
            </div>
            <svg
              className="h-6 w-6 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Setup Guide */}
      <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
        <h4 className="mb-4 text-xs font-black tracking-widest text-emerald-400 uppercase">
          Quick Setup Guide // 初期設定手順
        </h4>
        <ol className="space-y-3 text-sm text-gray-300">
          {resource.setupGuide.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          ご不明点やサポートが必要な場合は、お気軽に{' '}
          <a href="mailto:cwblog69@gmail.com" className="text-emerald-400 underline underline-offset-4">
            cwblog69@gmail.com
          </a>{' '}
          までご連絡ください。
        </p>
      </div>
    </motion.div>
  );
}

function SupportPageContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const productId = searchParams.get('product') || '';
  const sessionId = searchParams.get('session_id') || '';

  return (
    <div className="mx-auto max-w-4xl">
      {/* If purchase success, render Download Hub */}
      {isSuccess && <PurchaseSuccessHub productId={productId} sessionId={sessionId} />}

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
              ユーザー追跡や過剰な中間マージンを排除し、完全なプライバシーと減算の美学に基づいたAIツールを直接お届けします。
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              私たちの知性は、広告主ではなく、あなたに向いています。
              ここでの支援やご購入は、プライバシーが究極まで守られた新しいソフトウェアの形を共に作り上げるための共同投資です。
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
              OFUSE を通じて、独立系リサーチおよびオープンソース開発の継続をご支援いただけます。
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
        </div>
      </motion.div>
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
              Support & Downloads
            </span>
          </div>

          <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-8xl">
            TOOL ACCESS //
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
              DISTRIBUTION
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
