import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getVideos } from '../videos/services/videoService';
import { getAllNotes } from '../notes/services/noteService';
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

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVideos(), getAllNotes()])
      .then(([v, n]) => {
        setVideos(v.documents);
        setNotes(n.documents);
      })
      .finally(() => setLoading(false));
  }, []);

  const recentVideos = videos.slice(0, 4);
  const recentNotes = notes.slice(0, 3);
  const firstName = user?.name?.split(' ')[0] || 'Student';

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
            Hey {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {videos.length > 0
              ? `${videos.length} ${videos.length === 1 ? 'class' : 'classes'} to catch up on.`
              : "You're all caught up. Nice work!"}
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
          <StatCard icon="🎥" iconBg="var(--accent-soft)" iconColor="var(--accent)" label="Videos" value={videos.length} sublabel="Available" />
        </Link>
        <Link to="/notes" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard icon="📝" iconBg="var(--emerald-soft)" iconColor="var(--emerald)" label="Notes" value={notes.length} sublabel="Shared" />
        </Link>
        <StatCard icon="🔥" iconBg="var(--amber-soft)" iconColor="var(--amber)" label="Streak" value="1" sublabel="Keep going" />
        <Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <StatCard icon="✨" iconBg="var(--accent-soft)" iconColor="var(--accent)" label="AI Ready" value="✓" sublabel="Chat anytime" />
        </Link>
      </div>

      {/* Two-column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 20,
      }} className="lg:!grid-cols-3">
        {/* Videos */}
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
              Continue learning
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
          ) : recentVideos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 42, marginBottom: 14, opacity: 0.5 }}>🎬</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                No videos yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Be the first to share a recorded class.
              </p>
              <Link to="/upload"><button>Upload a video</button></Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {recentVideos.map(v => <VideoCard key={v.$id} video={v} />)}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* AI Promo */}
          <div style={{
            background: '#0f766e',
            borderRadius: 12,
            padding: 22,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 160, height: 160, borderRadius: 9999,
              background: 'rgba(255,255,255,0.08)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>✨</div>
              <h3 style={{
                fontSize: 16, fontWeight: 700,
                letterSpacing: '-0.02em', marginBottom: 6,
              }}>
                Ask AI anything
              </h3>
              <p style={{
                fontSize: 12.5, color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.55, marginBottom: 16,
              }}>
                Get instant help from your class notes.
              </p>
              <Link to="/chat">
                <button style={{
                  background: 'white', color: '#0f766e',
                  border: 'none', width: '100%',
                  padding: '10px 16px', fontSize: 13, fontWeight: 600,
                }}>
                  Open Assistant
                </button>
              </Link>
            </div>
          </div>

          {/* Notes */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            flex: 1,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 16,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.015em' }}>
                From your classmates
              </h2>
              <Link to="/notes" style={{ fontSize: 12, fontWeight: 500 }}>
                All →
              </Link>
            </div>

            {recentNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 12 }}>
                  No notes yet.
                </p>
                <Link to="/notes">
                  <button style={{
                    background: 'transparent',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    padding: '8px 16px', fontSize: 12.5,
                  }}>
                    Add the first note
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                {recentNotes.map((n, i) => (
                  <div
                    key={n.$id}
                    style={{
                      paddingBottom: 14,
                      marginBottom: 14,
                      borderBottom: i < recentNotes.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 9999,
                        background: 'var(--accent-soft)', color: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, flexShrink: 0,
                      }}>
                        {n.studentName?.[0]?.toUpperCase()}
                      </div>
                      <span style={{
                        fontSize: 11.5, fontWeight: 500,
                        color: 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {n.studentName}
                      </span>
                    </div>
                    {n.title && (
                      <p style={{
                        fontSize: 12.5, fontWeight: 600, marginBottom: 4,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {n.title}
                      </p>
                    )}
                    <p style={{
                      fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}