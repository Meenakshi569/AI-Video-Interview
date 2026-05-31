import Button from '../common/Button.jsx';

export default function HardwareCheck({ videoRef, status, onRunCheck, onContinue, canContinue }) {
  return (
    <div className="hardware-check card">
      <h1>Hardware check</h1>
      <p className="hardware-check__hint">
        Allow camera and microphone access before starting your interview.
      </p>

      <div className="hardware-check__preview">
        <video ref={videoRef} autoPlay muted playsInline className="hardware-check__video" />
      </div>

      <ul className="hardware-check__status-list">
        <li className={status.camera === 'ok' ? 'ok' : status.camera === 'fail' ? 'fail' : ''}>
          Camera: {statusLabel(status.camera)}
        </li>
        <li className={status.microphone === 'ok' ? 'ok' : status.microphone === 'fail' ? 'fail' : ''}>
          Microphone: {statusLabel(status.microphone)}
        </li>
      </ul>

      {status.error && <div className="alert alert--error">{status.error}</div>}

      <div className="hardware-check__actions">
        <Button variant="secondary" onClick={onRunCheck}>
          Test devices
        </Button>
        <Button onClick={onContinue} disabled={!canContinue}>
          Continue to interview
        </Button>
      </div>
    </div>
  );
}

function statusLabel(state) {
  if (state === 'ok') return 'Ready';
  if (state === 'fail') return 'Failed';
  if (state === 'checking') return 'Checking...';
  return 'Not tested';
}
