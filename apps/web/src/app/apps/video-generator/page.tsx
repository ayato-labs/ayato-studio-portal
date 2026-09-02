'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import {
  logVideoGeneration,
  updateVideoFeedback,
  VideoScriptData,
  VideoScriptScene,
} from '@/lib/video-logger';

// Sample templates for zero-friction testing
const SAMPLE_SCRIPTS: { name: string; description: string; data: VideoScriptData }[] = [
  {
    name: '宇宙探査の旅 (Space Odyssey)',
    description: '30秒で巡る深宇宙と惑星探査のストーリー',
    data: {
      title: 'space_journey_intro',
      scenes: [
        {
          scene_id: 1,
          text: '果てしない宇宙の彼方へ。人類は星々の秘密を解き明かす旅路へと出発しました。',
          image_prompt: 'cinematic photorealistic spaceship traveling through deep space near a glowing nebula, 8k resolution, volumetric lighting',
        },
        {
          scene_id: 2,
          text: '静寂に包まれた未知の惑星。地平線の向こうに巨大な環を持つ衛星が浮かび上がります。',
          image_prompt: 'alien planet surface with vibrant crystalline structures and ringed moon on horizon, cinematic landscape, unreal engine 5 render',
        },
        {
          scene_id: 3,
          text: '新たなフロンティアを目指す探査者たち。未来への挑戦はここから始まります。',
          image_prompt: 'futuristic astronaut looking at holographic star chart inside command module, high tech, highly detailed',
        },
      ],
    },
  },
  {
    name: '至高のハンドドリップ (Coffee Artisan)',
    description: '香りと静寂が織りなすコーヒー抽出の情景',
    data: {
      title: 'coffee_craft_story',
      scenes: [
        {
          scene_id: 1,
          text: '厳選された深煎り豆を、丁寧にグラインド。豊かな香りが静かに立ち上ります。',
          image_prompt: 'macro close-up of roasted dark coffee beans falling into vintage manual grinder, warm morning sunlight, shallow depth of field',
        },
        {
          scene_id: 2,
          text: '湯を注ぐと、ふわりと膨らむコーヒードーム。一滴一滴に職人の技が宿ります。',
          image_prompt: 'barista pouring hot water from stainless gooseneck kettle onto blooming coffee grounds in v60 dripper, cozy cafe atmosphere, 8k',
        },
        {
          scene_id: 3,
          text: '完成した一杯がもたらす、至福の休息。心解き放つ贅沢なひとときを。',
          image_prompt: 'steaming ceramic cup of black coffee on rustic wooden table with soft morning bokeh background, cinematic lighting',
        },
      ],
    },
  },
];

export default function VideoGeneratorPage() {
  const sessionId = useId();
  const [engineMode, setEngineMode] = useState<'wasm' | 'html5'>('wasm');
  const [inputMode, setInputMode] = useState<'form' | 'json'>('form');
  const [title, setTitle] = useState('my_ai_video');
  const [scenes, setScenes] = useState<VideoScriptScene[]>(SAMPLE_SCRIPTS[0].data.scenes);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_SCRIPTS[0].data, null, 2));

  // Generation & playback state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Feedback state
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync JSON when form changes
  const updateScript = (newTitle: string, newScenes: VideoScriptScene[]) => {
    setTitle(newTitle);
    setScenes(newScenes);
    setJsonInput(JSON.stringify({ title: newTitle, scenes: newScenes }, null, 2));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      if (parsed.title) setTitle(parsed.title);
      if (Array.isArray(parsed.scenes)) setScenes(parsed.scenes);
    } catch {
      // JSON still typing
    }
  };

  const loadSample = (sample: typeof SAMPLE_SCRIPTS[0]) => {
    updateScript(sample.data.title, sample.data.scenes);
    setGeneratedImages([]);
    setIsPlaying(false);
    setUserReaction(null);
    setIsFeedbackSubmitted(false);
  };

  const addScene = () => {
    const nextId = scenes.length + 1;
    const newScenes: VideoScriptScene[] = [
      ...scenes,
      { scene_id: nextId, text: '', image_prompt: '' },
    ];
    updateScript(title, newScenes);
  };

  const removeScene = (idx: number) => {
    if (scenes.length <= 1) return;
    const newScenes = scenes
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, scene_id: i + 1 }));
    updateScript(title, newScenes);
  };

  const updateSceneField = (idx: number, field: 'text' | 'image_prompt', val: string) => {
    const newScenes = [...scenes];
    newScenes[idx] = { ...newScenes[idx], [field]: val };
    updateScript(title, newScenes);
  };

  // Trigger media preview generation
  const handleGenerate = async () => {
    if (scenes.some((s) => !s.text.trim() || !s.image_prompt.trim())) {
      alert('すべてのシーンにナレーション文と画像プロンプトを入力してください。');
      return;
    }

    setIsGenerating(true);
    setUserReaction(null);
    setIsFeedbackSubmitted(false);
    setShowFeedbackModal(false);

    // Build Pollinations URLs
    const images = scenes.map((s, idx) => {
      const seed = (idx + 1) * 100;
      const encoded = encodeURIComponent(s.image_prompt.trim());
      return `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&seed=${seed}`;
    });
    setGeneratedImages(images);
    setActiveSceneIndex(0);

    // Save prompt & script log to Supabase
    const scriptPayload: VideoScriptData = { title, scenes };
    const promptSummary = scenes.map((s) => `[S${s.scene_id}] ${s.image_prompt}`).join(' | ');

    const logId = await logVideoGeneration({
      sessionId,
      title,
      prompt: promptSummary,
      script: scriptPayload,
      metadata: {
        engine: 'html5_preview',
        scene_count: scenes.length,
        client_timestamp: new Date().toISOString(),
      },
    });

    setCurrentLogId(logId);
    setIsGenerating(false);
    startPlayback(0, images);
  };

  const startPlayback = (startIndex: number, imagesList: string[]) => {
    setIsPlaying(true);
    setActiveSceneIndex(startIndex);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentText = scenes[startIndex]?.text || '';
      if (currentText) {
        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.lang = 'ja-JP';
        utterance.rate = 1.0;
        utterance.onend = () => {
          if (startIndex + 1 < scenes.length) {
            startPlayback(startIndex + 1, imagesList);
          } else {
            setIsPlaying(false);
          }
        };
        window.speechSynthesis.speak(utterance);
        return;
      }
    }

    if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    playbackTimerRef.current = setTimeout(() => {
      if (startIndex + 1 < scenes.length) {
        startPlayback(startIndex + 1, imagesList);
      } else {
        setIsPlaying(false);
      }
    }, 4500);
  };

  const handleReaction = async (reaction: 'like' | 'dislike') => {
    setUserReaction(reaction);
    if (!currentLogId) return;

    if (reaction === 'dislike') {
      setShowFeedbackModal(true);
    } else {
      await updateVideoFeedback({
        logId: currentLogId,
        reaction: 'like',
      });
      setIsFeedbackSubmitted(true);
    }
  };

  const submitDislikeFeedback = async () => {
    if (!currentLogId) return;
    await updateVideoFeedback({
      logId: currentLogId,
      reaction: 'dislike',
      feedbackCategory,
      feedbackText: feedbackComment,
    });
    setIsFeedbackSubmitted(true);
    setShowFeedbackModal(false);
  };

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <main className="bg-background min-h-screen py-16 text-white selection:bg-cyan-500/30 md:py-24">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] h-[45%] w-[45%] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="glass mb-4 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">
                Ayato Studio // Media Automation
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              AI VIDEO GENERATOR
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              構造化台本を入力するだけで、シーンごとのAI画像・音声・Ken Burnsプレビューを即座に合成します。
            </p>
          </div>

          {/* Engine Mode Switcher */}
          <div className="flex rounded-2xl border border-white/10 bg-black/60 p-1.5 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setEngineMode('wasm')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black tracking-wider uppercase transition-all ${
                engineMode === 'wasm'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Wasm / Flutter モード</span>
              <span className="rounded bg-black/30 px-1.5 py-0.5 text-[9px]">保護</span>
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('html5')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black tracking-wider uppercase transition-all ${
                engineMode === 'html5'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>軽量 HTML5 モード</span>
            </button>
          </div>
        </div>

        {engineMode === 'wasm' ? (
          /* Flutter Web Wasm Mode (100% Canvas / Binary Protection) */
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-black/80 shadow-2xl backdrop-blur-3xl">
              <div className="border-b border-white/5 bg-white/[0.02] px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-400">
                    FLUTTER_WASM_CANVASKIT_ENGINE :: ACTIVE
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-mono">Zero Backend // Private Binary</span>
              </div>
              <iframe
                src="/flutter-apps/video-generator/"
                title="AI Video Generator Wasm"
                className="h-[780px] w-full border-0 bg-[#050505]"
              />
            </div>

            {/* Legal Notice */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-gray-500 flex items-center justify-between">
              <span>
                本ツールのご利用には{' '}
                <Link href="/terms" className="text-cyan-400 underline hover:text-cyan-300">
                  利用規約
                </Link>{' '}
                および{' '}
                <Link href="/privacy" className="text-cyan-400 underline hover:text-cyan-300">
                  プライバシーポリシー
                </Link>{' '}
                （AI学習・データセット提供への同意）が適用されます。
              </span>
              <span className="text-[10px] text-gray-600 font-mono">Ayato Studio Protected System</span>
            </div>
          </div>
        ) : (
          /* Lightweight HTML5 Fallback Mode */
          <div>
            {/* Preset Sample Selector */}
            <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
              <p className="mb-3 text-xs font-bold tracking-widest text-cyan-400 uppercase">
                ワンクリック・サンプル台本
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SAMPLE_SCRIPTS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => loadSample(sample)}
                    className="flex flex-col items-start rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-cyan-500/40 hover:bg-white/[0.04]"
                  >
                    <span className="font-bold text-sm text-white">{sample.name}</span>
                    <span className="mt-1 text-xs text-gray-500">{sample.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Left Column: Script Editor (7 cols) */}
              <div className="space-y-6 lg:col-span-7">
                <div className="flex items-center justify-between">
                  <div className="flex rounded-xl bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() => setInputMode('form')}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                        inputMode === 'form'
                          ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      GUIフォーム入力
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('json')}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                        inputMode === 'json'
                          ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      JSON直接入力
                    </button>
                  </div>

                  <span className="text-xs text-gray-500 font-mono">
                    {scenes.length} Scenes Total
                  </span>
                </div>

                {/* Video Title */}
                <div>
                  <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    動画タイトル (Title / Filename)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => updateScript(e.target.value, scenes)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="my_video_project"
                  />
                </div>

                {inputMode === 'form' ? (
                  <div className="space-y-4">
                    {scenes.map((scene, idx) => (
                      <div
                        key={scene.scene_id}
                        className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-white/10"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[11px] font-bold text-cyan-400">
                            Scene #{scene.scene_id}
                          </span>
                          {scenes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeScene(idx)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              削除
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block mb-1 text-[11px] font-semibold text-gray-400">
                              ナレーションテキスト (日本語)
                            </label>
                            <textarea
                              rows={2}
                              value={scene.text}
                              onChange={(e) => updateSceneField(idx, 'text', e.target.value)}
                              placeholder="読み上げられるナレーションを入力..."
                              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 text-[11px] font-semibold text-gray-400">
                              画像生成プロンプト (英語推奨)
                            </label>
                            <input
                              type="text"
                              value={scene.image_prompt}
                              onChange={(e) => updateSceneField(idx, 'image_prompt', e.target.value)}
                              placeholder="cinematic photorealistic scene, 8k..."
                              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addScene}
                      className="w-full rounded-xl border border-dashed border-white/20 py-3 text-xs font-bold text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      + シーンを追加する
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                      ScriptData JSON
                    </label>
                    <textarea
                      rows={16}
                      value={jsonInput}
                      onChange={handleJsonChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-sm font-black tracking-widest text-black uppercase shadow-lg shadow-cyan-500/20 transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {isGenerating ? 'メディア生成中...' : '動画プレビューを生成する (Generate)'}
                  </button>
                </div>
              </div>

              {/* Right Column: Preview & RLHF Feedback (5 cols) */}
              <div className="space-y-6 lg:col-span-5">
                <div className="sticky top-28 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-2xl shadow-2xl">
                  <h2 className="mb-4 text-xs font-black tracking-widest text-cyan-400 uppercase">
                    ライブプレビュー (HTML5 Player)
                  </h2>

                  {/* Aspect 16:9 Screen */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 flex items-center justify-center">
                    {generatedImages.length > 0 ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImages[activeSceneIndex]}
                          alt={`Scene ${activeSceneIndex + 1}`}
                          className={`h-full w-full object-cover transition-all duration-1000 ${
                            isPlaying ? 'scale-110' : 'scale-100'
                          }`}
                        />

                        <div className="absolute top-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                          Scene {activeSceneIndex + 1} / {scenes.length}
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-center">
                          <p className="text-xs font-medium text-white drop-shadow-md leading-relaxed">
                            {scenes[activeSceneIndex]?.text}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center text-xs text-gray-500">
                        <p className="font-semibold text-gray-400 mb-1">プレビュー待機中</p>
                        <p>台本を入力し「動画プレビューを生成する」を押してください。</p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  {generatedImages.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => startPlayback(0, generatedImages)}
                        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                      >
                        {isPlaying ? '再生中...' : '最初から再生'}
                      </button>
                      <div className="flex gap-1">
                        {generatedImages.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                              }
                              setActiveSceneIndex(i);
                              setIsPlaying(false);
                            }}
                            className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                              activeSceneIndex === i
                                ? 'bg-cyan-500 text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RLHF Feedback */}
                  {generatedImages.length > 0 && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <p className="mb-2 text-xs font-bold text-gray-300">
                        生成結果の評価をお願いします:
                      </p>

                      {isFeedbackSubmitted ? (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-400">
                          ご評価ありがとうございました。データが正常に記録されました。
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleReaction('like')}
                            className={`flex-1 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                              userReaction === 'like'
                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                                : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08]'
                            }`}
                          >
                            いいね (Good)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReaction('dislike')}
                            className={`flex-1 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                              userReaction === 'dislike'
                                ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                                : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08]'
                            }`}
                          >
                            よくない (Bad)
                          </button>
                        </div>
                      )}

                      {showFeedbackModal && (
                        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs space-y-3">
                          <p className="font-bold text-rose-300">改善理由を教えてください (任意):</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'image_mismatch', label: '画像が意図と合わない' },
                              { id: 'audio_issue', label: '音声・発音が不自然' },
                              { id: 'timing_issue', label: 'シーンの尺が合わない' },
                              { id: 'other', label: 'その他' },
                            ].map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFeedbackCategory(cat.id)}
                                className={`rounded-lg border px-2 py-1.5 text-left text-[11px] ${
                                  feedbackCategory === cat.id
                                    ? 'border-rose-400 bg-rose-500/30 text-white'
                                    : 'border-white/10 bg-black/40 text-gray-400 hover:text-white'
                                }`}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                          <textarea
                            rows={2}
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            placeholder="詳細な改善点があればご記入ください..."
                            className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={submitDislikeFeedback}
                            className="w-full rounded-lg bg-rose-600 py-2 font-bold text-white hover:bg-rose-500 transition-colors"
                          >
                            フィードバックを送信する
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
