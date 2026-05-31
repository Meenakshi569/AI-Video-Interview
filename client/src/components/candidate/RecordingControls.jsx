import Button from '../common/Button.jsx';

export default function RecordingControls({
  recording,
  hasPreview,
  onStart,
  onStop,
  onClear,
  disabled,
}) {
  return (
    <div className="recording-controls">
      <h3>Record your answer</h3>
      {!recording && !hasPreview && (
        <Button onClick={onStart} disabled={disabled}>
          Start recording
        </Button>
      )}
      {recording && (
        <Button variant="secondary" onClick={onStop}>
          Stop recording
        </Button>
      )}
      {hasPreview && !recording && (
        <div className="recording-controls__actions">
          <Button variant="secondary" onClick={onClear}>
            Re-record
          </Button>
        </div>
      )}
      {recording && <span className="recording-controls__live">● Recording</span>}
    </div>
  );
}
