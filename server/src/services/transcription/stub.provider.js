import { TranscriptionProvider } from './transcription.interface.js';

export class StubTranscriptionProvider extends TranscriptionProvider {
  get name() {
    return 'stub';
  }

  async transcribe({ interviewId, mediaKeys }) {
    const placeholder = mediaKeys?.length
      ? `[Stub transcript] Interview ${interviewId} — ${mediaKeys.length} recording(s) queued for transcription.`
      : `[Stub transcript] Interview ${interviewId} — no recordings yet.`;

    return {
      fullText: placeholder,
      segments: mediaKeys.map((key, i) => ({
        questionIndex: i,
        text: `Stub segment for ${key}`,
        start: 0,
        end: 0,
      })),
      provider: this.name,
    };
  }
}
