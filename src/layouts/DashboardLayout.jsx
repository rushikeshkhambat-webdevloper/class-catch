import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function DashboardLayout() {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { setDrawerOpen(false); setMenuOpen(false); }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const linkBase = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors';
  const linkClass = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? '!bg-[var(--sidebar-active)] !text-white'
        : '!text-[var(--sidebar-text)] hover:!text-[var(--sidebar-text-hover)] hover:!bg-white/[0.06]'
    }`;

  const SectionLabel = ({ children }) => (
    <div style={{
      padding: '20px 12px 8px',
      fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#64748b',
    }}>
      {children}
    </div>
  );

  const SidebarContent = () => (
    <>
      <div style={{
        padding: '0 20px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}>
        <Link to="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: 11,
          color: 'white', textDecoration: 'none',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: '#0f766e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'white',
            flexShrink: 0,
          }}>
            CC
          </div>
          <span style={{
            fontWeight: 700, fontSize: 14.5,
            letterSpacing: '-0.02em', color: 'white',
          }}>
            Class Catch
          </span>
        </Link>
        <button
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden"
          style={{
            background: 'transparent', color: '#94a3b8',
            border: 'none', padding: 6, fontSize: 16,
          }}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav style={{ flex: 1, padding: '4px 12px 12px', overflowY: 'auto' }}>
        <SectionLabel>Main</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavLink to="/dashboard" className={linkClass}>
            <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>🏠</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/videos" className={linkClass}>
            <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>🎥</span>
            <span>Videos</span>
          </NavLink>
          <NavLink to="/notes" className={linkClass}>
            <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>📝</span>
            <span>Notes</span>
          </NavLink>
          <NavLink to="/upload" className={linkClass}>
            <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>⬆️</span>
            <span>Upload</span>
          </NavLink>
        </div>

        <SectionLabel>AI</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavLink to="/chat" className={linkClass}>
            <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>💬</span>
            <span>AI Assistant</span>
          </NavLink>
        </div>

        <SectionLabel>Account</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavLink to="/profile" className={linkClass}>
            <span style={{ fontSize: 15, lineHeight: 1, width: 18, textAlign: 'center' }}>👤</span>
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>

      <div style={{
        padding: 14,
        borderTop: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 8px', marginBottom: 12,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9999,
            background: '#0f766e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12.5, fontWeight: 700, flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: 13, fontWeight: 600,
              color: 'white', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name || 'User'}
            </p>
            <p style={{
              fontSize: 11, color: '#64748b',
              textTransform: 'capitalize', lineHeight: 1.3,
              marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {role}
            </p>
          </div>
        </div>

        <ThemeToggle variant="sidebar" />

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', color: '#94a3b8',
            border: '1px solid var(--sidebar-border)',
            width: '100%', justifyContent: 'center',
            padding: '9px 14px', marginTop: 8,
            fontSize: 13,
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>🚪</span>
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 240, flexShrink: 0,
          flexDirection: 'column',
          position: 'sticky', top: 0, height: '100vh',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden"
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="lg:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          height: '100vh', width: 260,
          display: 'flex', flexDirection: 'column',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.2s ease',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile header */}
        <header
          className="lg:hidden"
          style={{
            position: 'sticky', top: 0, zIndex: 30,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0 16px', height: 60,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: 'none', padding: 6,
            }}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: '#0f766e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: 'white',
            }}>
              CC
            </div>
            <span style={{
              fontWeight: 700, fontSize: 14,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}>
              Class Catch
            </span>
          </div>

          {/* User avatar dropdown (mobile) */}
          <div ref={menuRef} style={{ marginLeft: 'auto', position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label="Account menu"
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9999,
                background: '#0f766e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 13, fontWeight: 700,
              }}>
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                minWidth: 220,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                zIndex: 60,
              }}>
                {/* User info */}
                <div style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <p style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.name}
                  </p>
                  <p style={{
                    fontSize: 11, color: 'var(--text-tertiary)',
                    textTransform: 'capitalize', marginTop: 2,
                  }}>
                    {role}
                  </p>
                </div>

                {/* Menu items */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px',
                    fontSize: 13.5,
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: 15 }}>👤</span>
                  <span>Profile</span>
                </Link>

                <div style={{ padding: '4px 0' }}>
                  <ThemeToggle variant="menu" />
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%',
                    padding: '11px 14px',
                    fontSize: 13.5,
                    fontWeight: 500,
                    background: 'transparent',
                    color: 'var(--danger)',
                    border: 'none',
                    borderTop: '1px solid var(--border)',
                    borderRadius: 0,
                    justifyContent: 'flex-start',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 15 }}>🚪</span>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ flex: 1, overflowX: 'hidden' }}>
          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}