import { useEffect, useState } from 'react';
import { getToken } from '../../utils/token.js';
import Spinner from '../common/Spinner.jsx';

export default function VideoPlayer({ mediaUrl, title }) {
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mediaUrl) {
      setSrc(null);
      return;
    }

    let objectUrl;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const res = await fetch(mediaUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load video');
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } catch (err) {
        setError(err.message);
        setSrc(null);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaUrl]);

  if (!mediaUrl) return <p className="empty-state">No recording</p>;
  if (loading) return <Spinner label="Loading video..." />;
  if (error) return <div className="alert alert--error">{error}</div>;

  return (
    <div className="recruiter-video">
      {title && <h4>{title}</h4>}
      <video src={src} controls playsInline className="recruiter-video__player" />
    </div>
  );
}
