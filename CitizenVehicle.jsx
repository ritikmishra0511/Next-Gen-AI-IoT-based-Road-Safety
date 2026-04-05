// src/pages/citizen/CitizenVehicle.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getVehicle } from '../../utils/api';
import { useToast } from '../../hooks/useToast';
import ViolationBadge from '../../components/ViolationBadge';

export default function CitizenVehicle() {
  const { user } = useAuth();
  const toast = useToast();
  const [plate, setPlate] = useState(user?.vehiclePlate || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e?.preventDefault();
    if (!plate.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const r = await getVehicle(plate.trim().toUpperCase());
      setData(r.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Vehicle not found');
    } finally { setLoading(false); }
  }

  useEffect(() => { if (user?.vehiclePlate) handleSearch(); }, []);

  const riskColor = data?.riskScore === 'HIGH' ? 'var(--red)' : data?.riskScore === 'MEDIUM' ? 'var(--amber)' : 'var(--teal)';

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:800 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Vehicle Lookup</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>Search your vehicle registration and violation history</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display:'flex', gap:10, marginBottom:24 }}>
        <input className="input" style={{ flex:1 }} placeholder="Enter vehicle plate (e.g. MP09CD5678)" value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flexShrink:0 }}>
          {loading ? '⟳ Searching…' : '🔍 Search'}
        </button>
      </form>

      {/* Quick plates */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {['MH04AB1234','MP09CD5678','DL8CAF9012','UP32XY7890'].map(p => (
          <button key={p} onClick={() => { setPlate(p); }}
            style={{ fontSize:11, padding:'4px 10px', borderRadius:7, border:'1px solid var(--border)', background:'var(--bg3)', color:'var(--text2)', cursor:'pointer', fontFamily:'monospace' }}>{p}</button>
        ))}
      </div>

      {/* Result */}
      {data && (
        <div className="animate-fade-up">
          {/* Vehicle card */}
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:24, marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
              <div>
                <div className="font-mono" style={{ fontSize:28, fontWeight:600, marginBottom:4 }}>{data.plate}</div>
                <div style={{ fontSize:15, color:'var(--text2)' }}>{data.model} · {data.type}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'var(--text3)', marginBottom:4 }}>Risk Score</div>
                <div style={{ fontSize:18, fontWeight:700, color:riskColor, background:`${riskColor}15`, border:`1px solid ${riskColor}30`, padding:'4px 14px', borderRadius:20 }}>
                  {data.riskScore}
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { label:'Owner', value:data.owner },
                { label:'Total Violations', value:data.violationHistory?.length || 0, col:'var(--red)' },
                { label:'Total Fines', value:`₹${(data.totalFines||0).toLocaleString('en-IN')}`, col:'var(--amber)' },
              ].map((f,i) => (
                <div key={i} style={{ background:'var(--bg3)', padding:'12px 14px', borderRadius:9 }}>
                  <div style={{ fontSize:11, color:'var(--text3)', marginBottom:4 }}>{f.label}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:f.col||'var(--text)' }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Violation history */}
          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Violation History</h3>
            {data.violationHistory?.length === 0
              ? <div style={{ textAlign:'center', padding:24, color:'var(--text3)', fontSize:13 }}>✅ No violations recorded for this vehicle</div>
              : <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {data.violationHistory.map(v => (
                    <div key={v.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', background:'var(--bg3)', borderRadius:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <ViolationBadge type={v.type} />
                        <span style={{ fontSize:11, color:'var(--text3)' }}>{new Date(v.timestamp).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:'var(--amber)' }}>₹{v.fine?.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize:10, color: v.status==='paid'?'#22C55E':'var(--amber)', fontWeight:600 }}>{v.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}
