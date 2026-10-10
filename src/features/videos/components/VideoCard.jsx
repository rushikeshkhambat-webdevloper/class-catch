import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/videos/${video.$id}`}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'var(--text-primary)',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{
        width: '100%', aspectRatio: '16/9',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 9999,
          background: '#0f766e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 9px',
          background: 'rgba(15,23,42,0.75)',
          backdropFilter: 'blur(6px)',
          borderRadius: 6,
          fontSize: 10, fontWeight: 600,
          color: 'white',
          maxWidth: 'calc(100% - 20px)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {video.subject}
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <h3 style={{
          fontSize: 13.5, fontWeight: 600,
          letterSpacing: '-0.01em', marginBottom: 8,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.35,
        }}>
          {video.title}
        </h3>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11.5, color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 9999,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, flexShrink: 0,
          }}>
            {video.teacherName?.[0]?.toUpperCase()}
          </div>
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>
            {video.teacherName}
          </span>
          {video.date && (
            <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
              {video.date}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}