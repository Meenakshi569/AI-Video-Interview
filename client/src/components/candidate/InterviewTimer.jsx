export default function InterviewTimer({ formatted, expired, secondsLeft }) {
  return (
    <div className={`interview-timer${expired ? ' interview-timer--expired' : ''}`}>
      <span className="interview-timer__label">Time remaining</span>
      <span className="interview-timer__value">{formatted}</span>
      {expired && <span className="interview-timer__warn">Time is up — submit when ready</span>}
      {!expired && secondsLeft <= 30 && (
        <span className="interview-timer__warn">Less than 30 seconds left</span>
      )}
    </div>
  );
}
