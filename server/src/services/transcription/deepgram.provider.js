import { TranscriptionProvider } from './transcription.interface.js';
import { logger } from '../../utils/logger.js';

/**
 * Deepgram integration placeholder — set TRANSCRIPTION_PROVIDER=deepgram and DEEPGRAM_API_KEY.
 */
export class DeepgramTranscriptionProvider extends TranscriptionProvider {
  get name() {
    return 'deepgram';
  }

  async transcribe({ interviewId, mediaKeys }) {
    if (!process.env.DEEPGRAM_API_KEY) {
      logger.warn('DEEPGRAM_API_KEY not set; falling back to stub text');
      return {
        fullText: `[Deepgram stub] Configure DEEPGRAM_API_KEY for interview ${interviewId}`,
        segments: [],
        provider: this.name,
      };
    }

    // Phase 9: wire Deepgram SDK / REST here using mediaKeys + local paths
    return {
      fullText: `[Deepgram pending] ${mediaKeys.length} file(s) for interview ${interviewId}`,
      segments: [],
      provider: this.name,
    };
  }
}
