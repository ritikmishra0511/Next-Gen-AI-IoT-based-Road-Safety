// src/pages/operator/EmergencyPage.jsx
import { useState, useEffect } from 'react';
import { getEmergencies, createEmergency, resolveEmergency } from '../../utils/api';
import { useToast } from '../../hooks/useToast';

const LOCS = ['NH-46 Near Toll Plaza','DB Road Junction','Ring Road Km 12','AIIMS Bhopal Junction','Bhopal-Indore Highway Km 34','Habibganj Flyover','MP Nagar Square','Kolar Road Junction'];

export default function EmergencyPage() {
  const toast = useToast();
  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [firing, setFiring] = useState(false);
  const [customLoc, setCustomLoc] = useState('');

  async function load() {
    try { const r = await getEmergencies(); setAlerts(r.data.alerts); setTotal(r.data.total); } catch {}
  }

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, []);

  async function fireAlert() {
    setFiring(true);
    try {
      await createEmergency({ location: customLoc || undefined });
      toast.error('🚨 Emergency alert dispatched to responders!');
      setCustomLoc('');
      load();
    } catch { toast.error('Failed to dispatch alert'); }
    finally { setFiring(false); }
  }

  async function handleResolve(id) {
    try { await resolveEmergency(id); toast.success('Alert marked resolved'); load(); }
    catch { toast.error('Failed to resolve'); }
  }

  const active = alerts.filter(a => a.status === 'active');
  const resolved = alerts.filter(a => a.status === 'resolved');

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:1000 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Emergency Response</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>{active.length} active · {resolved.length} resolved · {total} total</p>
      </div>

      {/* Dispatch */}
      <div style={{ background:'rgba(255,71,87,0.06)', border:'1px solid rgba(255,71,87,0.2)', borderRadius:14, padding:20, marginBottom:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--red)', marginBottom:12 }}>🚨 Dispatch Emergency Alert</div>
        <div style={{ display:'flex', gap:10 }}>
          <input className="input" style={{ flex:1 }} placeholder="Enter accident location (or leave blank for random)" value={customLoc} onChange={e=>setCustomLoc(e.target.value)} />
          <button className="btn" style={{ background:'var(--red)', color:'#fff', flexShrink:0, padding:'10px 22px' }} disabled={firing} onClick={fireAlert}>
            {firing ? '⟳ Dispatching…' : '🚨 Dispatch Now'}
          </button>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
          {LOCS.slice(0,4).map(l => (
            <button key={l} onClick={() => setCustomLoc(l)}
              style={{ fontSize:11, padding:'4px 10px', borderRadius:7, border:'1px solid rgba(255,71,87,0.2)', background:'rgba(255,71,87,0.08)', color:'var(--red)', cursor:'pointer' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Active alerts */}
      {active.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'var(--red)', display:'flex', alignItems:'center', gap:8 }}>
            <span className="live-dot" style={{ background:'var(--red)' }} /> Active Emergencies ({active.length})
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {active.map(a => <AlertCard key={a.id} alert={a} onResolve={handleResolve} />)}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h2 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'var(--text2)' }}>Resolved ({resolved.length})</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {resolved.map(a => <AlertCard key={a.id} alert={a} resolved />)}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text3)' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
          <p style={{ fontSize:14 }}>No emergency alerts. Roads are safe.</p>
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, onResolve, resolved }) {
  return (
    <div style={{
      background: resolved ? 'var(--bg2)' : 'rgba(255,71,87,0.06)',
      border: `1px solid ${resolved ? 'var(--border)' : 'rgba(255,71,87,0.25)'}`,
      borderRadius:12, padding:'16px 18px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap',
    }}>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <span style={{ fontSize:13, fontWeight:700, color: resolved ? 'var(--text2)' : 'var(--red)' }}>
            {resolved ? '✅' : '🔴'} {alert.location}
          </span>
          <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600,
            background: resolved ? 'rgba(34,197,94,0.1)' : 'rgba(255,71,87,0.1)',
            color: resolved ? '#22C55E' : 'var(--red)',
          }}>{alert.status}</span>
        </div>
        <div style={{ fontSize:12, color:'var(--text3)' }}>
          Responders: {alert.responders?.join(', ')} · ETA: {alert.eta}
        </div>
        <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>
          {new Date(alert.timestamp).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}
          {alert.resolvedAt && ` · Resolved: ${new Date(alert.resolvedAt).toLocaleTimeString('en-IN',{hour12:false})}`}
        </div>
      </div>
      {!resolved && onResolve && (
        <button onClick={() => onResolve(alert.id)}
          style={{ padding:'8px 16px', borderRadius:8, border:'1px solid rgba(34,197,94,0.25)', background:'rgba(34,197,94,0.1)', color:'#22C55E', fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
          ✓ Resolve
        </button>
      )}
    </div>
  );
}
