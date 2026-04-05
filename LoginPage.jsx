// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function LoginPage() {
  const [params] = useSearchParams();
  const defaultRole = params.get('role') || 'operator';
  const [role, setRole] = useState(defaultRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(user.role === 'operator' ? '/operator' : '/citizen', { replace: true });
  }, [isAuthenticated]);

  // Auto-fill demo credentials
  useEffect(() => {
    setUsername(role === 'operator' ? 'operator' : 'citizen');
    setPassword(role === 'operator' ? 'admin123' : 'citizen123');
  }, [role]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password, role);
      toast.success(`Welcome back! Redirecting…`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 700px 500px at 50% 40%, rgba(0,229,192,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }} className="animate-fade-up">
        {/* Back */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: 13, textDecoration: 'none', marginBottom: 32 }}>
          ← Back to home
        </Link>

        {/* Card */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🚦</div>
            <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Sign In</h2>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>SafeRoad AI Platform</p>
          </div>

          {/* Role tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg3)', padding: 4, borderRadius: 12, marginBottom: 24 }}>
            {[{ id: 'operator', label: '🚔 Operator' }, { id: 'citizen', label: '🧑‍💼 Citizen' }].map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: role === r.id ? 'var(--bg4)' : 'transparent',
                  color: role === r.id ? 'var(--text)' : 'var(--text2)',
                  boxShadow: role === r.id ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
                }}
              >{r.label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>Username</label>
              <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>Password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }} disabled={loading}>
              {loading ? <span className="animate-spin-slow" style={{ display: 'inline-block' }}>⟳</span> : null}
              {loading ? 'Signing in…' : `Sign in as ${role === 'operator' ? 'Operator' : 'Citizen'}`}
            </button>
          </form>

          {/* Demo creds hint */}
          <div style={{ marginTop: 20, background: 'var(--bg3)', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: 'var(--text3)' }}>
            <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Demo credentials auto-filled.</span> Just click Sign In to try.
          </div>
        </div>
      </div>
    </div>
  );
}
