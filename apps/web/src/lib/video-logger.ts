/**
 * AI Video Generator - Supabase Data & Feedback Logger
 * Ayato Studio
 */

import { supabase } from './api';
import { logger } from './logger';

export interface VideoScriptScene {
  scene_id: number;
  text: string;
  image_prompt: string;
}

export interface VideoScriptData {
  title: string;
  scenes: VideoScriptScene[];
}

export interface VideoLogPayload {
  sessionId: string;
  title: string;
  prompt: string;
  script: VideoScriptData;
  videoUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface FeedbackPayload {
  logId: string;
  reaction: 'like' | 'dislike';
  feedbackCategory?: string;
  feedbackText?: string;
}

/**
 * Inserts prompt and script generation log to Supabase.
 * Returns the generated record ID if successful, or null on failure.
 */
export async function logVideoGeneration(payload: VideoLogPayload): Promise<string | null> {
  if (!supabase) {
    logger.warn('Supabase client not initialized. Skipping prompt logging.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('video_generation_logs')
      .insert({
        session_id: payload.sessionId,
        title: payload.title,
        prompt: payload.prompt,
        generated_script: payload.script,
        video_url: payload.videoUrl || null,
        status: 'completed',
        metadata: payload.metadata || {},
      })
      .select('id')
      .single();

    if (error) {
      logger.error({ error: error.message }, 'Failed to insert video generation log');
      return null;
    }

    logger.debug({ id: data?.id }, 'Video generation log saved successfully');
    return data?.id || null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error({ error: msg }, 'Unexpected error saving video generation log');
    return null;
  }
}

/**
 * Updates reaction (like/dislike) and feedback details for a specific generation log.
 */
export async function updateVideoFeedback(payload: FeedbackPayload): Promise<boolean> {
  if (!supabase) {
    logger.warn('Supabase client not initialized. Skipping feedback update.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('video_generation_logs')
      .update({
        reaction: payload.reaction,
        feedback_category: payload.feedbackCategory || null,
        feedback_text: payload.feedbackText || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payload.logId);

    if (error) {
      logger.error({ error: error.message, logId: payload.logId }, 'Failed to update video feedback');
      return false;
    }

    logger.info({ logId: payload.logId, reaction: payload.reaction }, 'Video feedback recorded successfully');
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error({ error: msg, logId: payload.logId }, 'Unexpected error updating video feedback');
    return false;
  }
}
