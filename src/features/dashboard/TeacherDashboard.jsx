import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getVideos } from '../videos/services/videoService';
import { AuthContext } from '../../context/AuthContext';
import VideoCard from '../videos/components/VideoCard';

function StatCard({ icon, iconBg, iconColor, label, value, sublabel }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>
      <div>
        <p style={{
          fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.035em', lineHeight: 1,
          marginBottom: 6,
        }}>
          {value}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {sublabel}
        </p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getVideos()
      .then(res => setVideos(res.documents.filter(v => v.teacherId === user.$id)))
      .finally(() => setLoading(false));
  }, [user]);

  const subjects = new Set(videos.map(v => v.subject)).size;
  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  return (
    <div>
      {/* Hero with two buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginBottom: 28,
      }} className="sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            letterSpacing: '-0.025em', lineHeight: 1.25,
            marginBottom: 6,
          }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Here's what's happening with your classes today.
          </p>
        </div>
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          alignSelf: 'flex-start',
        }}>
          <Link to="/upload">
            <button style={{ padding: '11px 20px' }}>
              <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 400 }}>+</span>
              <span>Upload Video</span>
            </button>
          </Link>
          <Link to="/notes">
            <button style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              padding: '11px 20px',
            }}>
              <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 400 }}>+</span>
              <span>Add Note</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
        marginBottom: 28,
      }} className="lg:!grid-cols-4">
        <Link to="/videos" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard icon="🎥" iconBg="var(--accent-soft)" iconColor="var(--accent)" label="Videos" value={videos.length} sublabel={`${videos.length} uploaded`} />
        </Link>
        <StatCard icon="📚" iconBg="var(--emerald-soft)" iconColor="var(--emerald)" label="Subjects" value={subjects} sublabel={`${subjects} covered`} />
        <Link to="/notes" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard icon="📝" iconBg="var(--amber-soft)" iconColor="var(--amber)" label="Notes" value="—" sublabel="From students" />
        </Link>
        <Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard icon="✨" iconBg="var(--accent-soft)" iconColor="var(--accent)" label="AI Ready" value="✓" sublabel="All systems go" />
        </Link>
      </div>

      {/* Two-column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 20,
      }} className="lg:!grid-cols-3">
        {/* Recent */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 20,
        }} className="lg:!col-span-2">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}>
              Recent uploads
            </h2>
            <Link to="/videos" style={{ fontSize: 13, fontWeight: 500 }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
                  <div style={{ padding: 12 }}>
                    <div className="skeleton" style={{ height: 11, width: '75%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 9, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 42, marginBottom: 14, opacity: 0.5 }}>🎬</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                No videos yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Upload your first class video to get started.
              </p>
              <Link to="/upload"><button>Upload video</button></Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {videos.slice(0, 4).map(v => <VideoCard key={v.$id} video={v} />)}
            </div>
          )}
        </div>

        {/* AI Promo */}
        <div style={{
          background: '#0f766e',
          borderRadius: 12,
          padding: 24,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 240,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 180, height: 180, borderRadius: 9999,
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 20,
            }}>
              ✨
            </div>
            <h3 style={{
              fontSize: 18, fontWeight: 700,
              letterSpacing: '-0.02em', marginBottom: 8,
              lineHeight: 1.25,
            }}>
              AI Study Assistant
            </h3>
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.55, marginBottom: 20,
            }}>
              Ask questions about your class notes and get instant answers.
            </p>
          </div>
          <Link to="/chat" style={{ position: 'relative', zIndex: 1 }}>
            <button style={{
              background: 'white', color: '#0f766e',
              border: 'none', width: '100%',
              fontWeight: 600, padding: '11px 18px',
            }}>
              Open Assistant →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}