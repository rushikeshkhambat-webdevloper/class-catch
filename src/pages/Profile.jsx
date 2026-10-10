import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, role } = useContext(AuthContext);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: 6
        }}>
          Profile 👤
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Your account details and activity
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 28,
        maxWidth: 640
      }}>
        {/* Avatar + name */}
        <div className="flex items-center gap-4" style={{
          paddingBottom: 24,
          marginBottom: 24,
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 24,
            fontWeight: 700,
            flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.015em',
              marginBottom: 3
            }}>
              {user?.name}
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20
        }}>
          <div>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 8
            }}>
              Role
            </p>
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {role}
            </p>
          </div>

          <div>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 8
            }}>
              Member since
            </p>
            <p style={{ fontSize: 14, fontWeight: 600 }}>
              {new Date(user?.$createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}