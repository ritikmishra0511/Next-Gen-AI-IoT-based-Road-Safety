// src/pages/citizen/CitizenHome.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getViolations, getViolationStats } from '../../utils/api';
import ViolationBadge from '../../components/ViolationBadge';

export default function CitizenHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total:0, totalFine:0, pending:0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [sR, vR] = await Promise.all([getViolationStats(), getViolations({ limit:5, vehicle: user?.vehiclePlate || '' })]);
        setStats(sR.data);
        setRecent(vR.data.violations);
      } catch {}
    }
    load();
  }, []);

  const scoreColor = stats.pending === 0 ? 'var(--teal)' : stats.pending < 3 ? 'var(--amber)' : 'var(--red)';
  const scoreLabel = stats.pending === 0 ? 'Excellent' : stats.pending < 3 ? 'Good' : 'Needs Attention';

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:900 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>
          Welcome, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>Your road safety dashboard</p>
      </div>

      {/* Score card */}
      <div style={{ background:'linear-gradient(135deg, rgba(0,229,192,0.08), rgba(59,130,246,0.05))', border:'1px solid rgba(0,229,192,0.2)', borderRadius:16, padding:24, marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontSize:12, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>Safety Score</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span className="font-display" style={{ fontSize:52, fontWeight:800, color:scoreColor, lineHeight:1 }}>
              {Math.max(0, 100 - (stats.pending * 15))}
            </span>
            <span style={{ fontSize:16, color:'var(--text3)' }}>/100</span>
          </div>
          <div style={{ marginTop:6, fontSize:13, color:scoreColor, fontWeight:600 }}>{scoreLabel}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, minWidth:180 }}>
          <InfoRow label="Vehicle" value={user?.vehiclePlate || 'Not linked'} />
          <InfoRow label="Pending Fines" value={stats.pending} col={stats.pending > 0 ? 'var(--red)' : 'var(--teal)'} />
          <InfoRow label="Total Fines Incurred" value={`₹${(stats.totalFine||0).toLocaleString('en-IN')}`} col="var(--amber)" />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[
          { icon:'📋', label:'Total Violations', val:stats.total,    col:'var(--red)'  },
          { icon:'⏳', label:'Pending',          val:stats.pending,  col:'var(--amber)'},
          { icon:'💸', label:'Total Fines',      val:`₹${(stats.totalFine||0).toLocaleString('en-IN')}`, col:'var(--purple)' },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div className="font-mono" style={{ fontSize:22, fontWeight:600, color:s.col, marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:12, color:'var(--text2)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent violations */}
      <div className="card" style={{ padding:20 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Recent Activity</h3>
        {recent.length === 0
          ? <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text3)' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>✅</div>
              <p style={{ fontSize:13 }}>No violations recorded. Keep driving safely!</p>
            </div>
          : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {recent.map(v => (
                <div key={v.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'var(--bg3)', borderRadius:9 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <ViolationBadge type={v.type} />
                    <span style={{ fontSize:12, color:'var(--text3)' }}>{new Date(v.timestamp).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--amber)' }}>₹{v.fine?.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background: v.status==='paid' ? 'rgba(34,197,94,0.1)' : 'rgba(255,184,0,0.1)', color: v.status==='paid' ? '#22C55E' : 'var(--amber)', fontWeight:600 }}>{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

function InfoRow({ label, value, col }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
      <span style={{ color:'var(--text3)' }}>{label}</span>
      <span style={{ fontWeight:600, color: col || 'var(--text)' }}>{value}</span>
    </div>
  );
}
