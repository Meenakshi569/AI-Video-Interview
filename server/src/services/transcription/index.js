import { StubTranscriptionProvider } from './stub.provider.js';
import { DeepgramTranscriptionProvider } from './deepgram.provider.js';

let provider = null;

export function getTranscriptionProvider() {
  if (provider) return provider;

  const name = process.env.TRANSCRIPTION_PROVIDER || 'stub';
  switch (name) {
    case 'deepgram':
      provider = new DeepgramTranscriptionProvider();
      break;
    default:
      provider = new StubTranscriptionProvider();
  }
  return provider;
}
