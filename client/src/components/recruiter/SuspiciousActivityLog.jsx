export default function SuspiciousActivityLog({ events }) {
  if (!events?.length) {
    return (
      <div className="suspicious-log card">
        <h3>Suspicious activity</h3>
        <p className="empty-state">No flags recorded for this interview.</p>
      </div>
    );
  }

  return (
    <div className="suspicious-log card">
      <h3>Suspicious activity ({events.length})</h3>
      <ul className="suspicious-log__list">
        {events.map((ev) => (
          <li key={ev._id || `${ev.type}-${ev.timestamp}`}>
            <span className="suspicious-log__type">{ev.type.replace(/_/g, ' ')}</span>
            <time>{new Date(ev.timestamp).toLocaleString()}</time>
            {ev.metadata?.reason && (
              <span className="suspicious-log__meta">{ev.metadata.reason}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
