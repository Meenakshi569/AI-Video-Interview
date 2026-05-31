import Button from '../common/Button.jsx';

export default function TranscriptPanel({ transcript, onGenerate, generating }) {
  const text = transcript?.fullText || '';
  const status = transcript?.status || 'pending';

  return (
    <div className="transcript-panel card">
      <div className="transcript-panel__header">
        <h3>Transcript</h3>
        <span className={`status-pill status-pill--${status}`}>{status}</span>
      </div>
      {status === 'pending' && !text && (
        <p className="transcript-panel__placeholder">
          Transcript not generated yet. Click below to run speech-to-text (stub provider
          until Deepgram is configured).
        </p>
      )}
      <div className="transcript-panel__body">
        {text || <em className="muted">No transcript available.</em>}
      </div>
      {transcript?.provider && (
        <p className="transcript-panel__meta">Provider: {transcript.provider}</p>
      )}
      <Button variant="secondary" onClick={onGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate transcript'}
      </Button>
    </div>
  );
}
