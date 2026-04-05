// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Sidebar({ items, role }) {
  const { user, logout } = useAuth();
  const toast = useToast();

  async function handleLogout() {
    await logout();
    toast.info('Logged out successfully');
  }

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,229,192,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚦</div>
          <div>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}>SafeRoad AI</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{role}</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: role === 'operator' ? 'rgba(59,130,246,0.15)' : 'rgba(0,229,192,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
          {role === 'operator' ? '🚔' : '🧑‍💼'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{user?.badge || user?.vehiclePlate || user?.username}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {items.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9,
              fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s',
              color: isActive ? 'var(--text)' : 'var(--text2)',
              background: isActive ? 'var(--bg4)' : 'transparent',
            })}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
            {item.badge ? (
              <span style={{ marginLeft: 'auto', background: 'rgba(255,71,87,0.15)', color: 'var(--red)', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: 'var(--text2)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}
        >
          <span style={{ fontSize: 16 }}>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );
}
