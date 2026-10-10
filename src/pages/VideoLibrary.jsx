import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVideos } from '../features/videos/services/videoService';
import VideoCard from '../features/videos/components/VideoCard';

export default function VideoLibrary() {
  const [videos, setVideos] = useState([]);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVideos(subject || null)
      .then(res => setVideos(res.documents))
      .finally(() => setLoading(false));
  }, [subject]);

  return (
    <div>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28,
      }} className="sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            letterSpacing: '-0.025em', marginBottom: 6,
          }}>
            Video Library 🎥
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {videos.length > 0
              ? `${videos.length} ${videos.length === 1 ? 'video' : 'videos'} available`
              : 'Browse all recorded classes'}
          </p>
        </div>
        <Link to="/upload" style={{ alignSelf: 'flex-start' }}>
          <button style={{ padding: '11px 20px' }}>
            <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 400 }}>+</span>
            <span>Upload Video</span>
          </button>
        </Link>
      </div>

      <div style={{ marginBottom: 24, maxWidth: 360 }}>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Filter by subject..."
        />
      </div>

      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-card)' }}>
              <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
              <div style={{ padding: 14 }}>
                <div className="skeleton" style={{ height: 11, width: '75%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 9, width: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '60px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.5 }}>🎬</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            {subject ? 'No videos found' : 'No videos yet'}
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 22 }}>
            {subject ? 'Try a different filter.' : 'Be the first to upload!'}
          </p>
          {!subject && (
            <Link to="/upload"><button>Upload the first video</button></Link>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {videos.map(v => <VideoCard key={v.$id} video={v} />)}
        </div>
      )}
    </div>
  );
}