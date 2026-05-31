import { Link } from 'react-router-dom';

export default function CandidateTable({ interviews }) {
  if (!interviews?.length) {
    return <p className="empty-state">No interviews yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Email</th>
            <th>Status</th>
            <th>Responses</th>
            <th>Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {interviews.map((item) => (
            <tr key={item.id}>
              <td>{item.candidate?.name || '—'}</td>
              <td>{item.candidate?.email || '—'}</td>
              <td>
                <span className={`status-pill status-pill--${item.status}`}>
                  {item.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td>{item.responseCount}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>
                <Link to={`/recruiter/interviews/${item.id}`} className="link-btn">
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
