// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const stats = [
  { num: '1.35M', label: 'Deaths / Year', color: 'var(--red)' },
  { num: '95%+', label: 'AI Accuracy', color: 'var(--teal)' },
  { num: '40%', label: 'Faster Response', color: 'var(--blue)' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user.role === 'operator' ? '/operator' : '/citizen', { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 800px 500px at 20% 50%, rgba(0,229,192,0.04) 0%, transparent 60%), radial-gradient(ellipse 600px 400px at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', width: '100%', textAlign: 'center' }} className="animate-fade-up">

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,229,192,0.08)', border: '1px solid rgba(0,229,192,0.2)', padding: '6px 18px', borderRadius: 30, fontSize: 12, fontWeight: 500, color: 'var(--teal)', letterSpacing: '0.5px', marginBottom: 32 }}>
          <span className="live-dot" />
          AI + IoT Road Safety Platform — v2.0
        </div>

        {/* Title */}
        <h1 className="font-display" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 20 }}>
          Smarter Roads,{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--teal), #00B4D8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Safer Lives
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.7 }}>
          Next-generation AI & IoT road safety system combining helmet-lock prevention, YOLO v8 detection, automated enforcement, and real-time emergency response.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', maxWidth: 540, margin: '0 auto 52px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '20px 12px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: 26, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 680, margin: '0 auto' }}>
          <RoleCard
            icon="🚔"
            title="Traffic Operator"
            desc="Monitor violations, manage challans, track emergencies & control IoT devices."
            features={['Real-time violation feed', 'IoT helmet/RFID control', 'Emergency alerts', 'Analytics dashboard']}
            color="var(--blue)"
            colorDim="rgba(59,130,246,0.1)"
            onClick={() => navigate('/login?role=operator')}
          />
          <RoleCard
            icon="🧑‍💼"
            title="Citizen Portal"
            desc="View your challans, check violations, make payments & report incidents."
            features={['View pending challans', 'Pay fines online', 'Vehicle history', 'Safety score']}
            color="var(--teal)"
            colorDim="rgba(0,229,192,0.1)"
            onClick={() => navigate('/login?role=citizen')}
          />
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: 'var(--text3)' }}>
          🔒 Secured with JWT authentication · By Mahima Sharma, Ritik Mishra, Vivek Kumar Mishra
        </p>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, desc, features, color, colorDim, onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, padding: '28px 24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.background = 'var(--bg3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: colorDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{icon}</div>
      <div className="font-display" style={{ fontSize: 19, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 18 }}>{desc}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {features.map((f, i) => (
          <li key={i} style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />{f}
          </li>
        ))}
      </ul>
      <div style={{ position: 'absolute', bottom: 20, right: 20, width: 32, height: 32, borderRadius: '50%', background: colorDim, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>→</div>
    </button>
  );
}
