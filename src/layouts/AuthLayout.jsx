import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#14b8a6',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT — Dark slate brand panel */}
      <div
        className="hidden lg:flex"
        style={{
          width: '44%',
          background: '#0f172a',
          color: 'white',
          padding: '56px 64px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative teal blobs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: 400, height: 400, borderRadius: 9999,
          background: 'rgba(20, 184, 166, 0.08)', filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-80px',
          width: 340, height: 340, borderRadius: 9999,
          background: 'rgba(20, 184, 166, 0.05)', filter: 'blur(40px)',
        }} />

        {/* Brand */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 9,
              background: '#0f766e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white',
              letterSpacing: '-0.01em',
            }}>
              CC
            </div>
            <span style={{
              fontSize: 16, fontWeight: 700,
              letterSpacing: '-0.02em', color: 'white',
            }}>
              Class Catch
            </span>
          </Link>
        </div>

        {/* Center hero */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <h1 style={{
            fontSize: 42, fontWeight: 700,
            lineHeight: 1.12, letterSpacing: '-0.03em',
            marginBottom: 24, color: 'white',
          }}>
            Never miss a<br />class again.
          </h1>
          <p style={{
            fontSize: 15, lineHeight: 1.65, color: '#94a3b8',
            marginBottom: 44, maxWidth: 400,
          }}>
            Catch up on recorded classes, share notes with classmates,
            and get AI-powered summaries in one place.
          </p>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Recorded classes anytime, anywhere',
              'Shared notes from your classmates',
              'AI assistant that reads your notes',
            ].map(text => (
              <li key={text} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                fontSize: 14, color: '#cbd5e1', lineHeight: 1.5,
              }}>
                <span style={{
                  marginTop: 8, width: 5, height: 5, borderRadius: 9999,
                  background: '#14b8a6', flexShrink: 0,
                }} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          position: 'relative', zIndex: 1,
          fontSize: 12, color: '#64748b',
        }}>
          © 2026 Class Catch
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'white',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          alignItems: 'center', padding: '24px 32px',
        }}>
          <button
            onClick={() => {
              const html = document.documentElement;
              const current = html.getAttribute('data-theme') || 'light';
              const next = current === 'dark' ? 'light' : 'dark';
              html.setAttribute('data-theme', next);
              localStorage.setItem('theme', next);
            }}
            style={{
              background: 'white', color: '#334155',
              border: '1px solid #e5e9e9',
              padding: 10, borderRadius: 8,
              minWidth: 42, fontSize: 14, lineHeight: 1,
            }}
          >
            🌙
          </button>
        </div>

        {/* Form — vertically centered, horizontally centered in right panel */}
        <div style={{
          flex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 32px 72px',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{
                fontSize: 26, fontWeight: 700,
                letterSpacing: '-0.02em', color: '#0f172a',
                marginBottom: 8,
              }}>
                {isLogin ? 'Sign in' : 'Create account'}
              </h2>
              <p style={{ fontSize: 14, color: '#5c6b6b', lineHeight: 1.5 }}>
                {isLogin
                  ? 'Enter your credentials to continue.'
                  : 'Get started with Class Catch in seconds.'}
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}