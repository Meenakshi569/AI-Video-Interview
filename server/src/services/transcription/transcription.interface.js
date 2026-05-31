/**
 * Modular transcription provider contract.
 */
export class TranscriptionProvider {
  get name() {
    return 'base';
  }

  async transcribe({ interviewId, mediaKeys }) {
    throw new Error('transcribe() not implemented');
  }
}
