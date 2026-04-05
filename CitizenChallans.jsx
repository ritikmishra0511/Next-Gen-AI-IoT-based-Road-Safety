// src/pages/citizen/CitizenChallans.jsx
import { useState, useEffect } from 'react';
import { getViolations, payViolation } from '../../utils/api';
import { useToast } from '../../hooks/useToast';
import ViolationBadge from '../../components/ViolationBadge';

export default function CitizenChallans() {
  const toast = useToast();
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState('');

  async function load() {
    setLoading(true);
    try { const r = await getViolations({ limit:50 }); setViolations(r.data.violations); }
    catch { toast.error('Failed to load challans'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handlePay(id) {
    setPaying(id);
    try { await payViolation(id); toast.success('✅ Fine paid successfully!'); load(); }
    catch { toast.error('Payment failed. Try again.'); }
    finally { setPaying(''); }
  }

  const pending = violations.filter(v => v.status === 'pending');
  const paid    = violations.filter(v => v.status === 'paid');
  const totalPending = pending.reduce((s,v) => s+v.fine, 0);

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:900 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>My Challans</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>{violations.length} total · {pending.length} pending</p>
      </div>

      {/* Pending summary */}
      {pending.length > 0 && (
        <div style={{ background:'rgba(255,184,0,0.07)', border:'1px solid rgba(255,184,0,0.2)', borderRadius:14, padding:20, marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:12, color:'var(--text3)', marginBottom:4 }}>Total Pending Amount</div>
            <div className="font-mono" style={{ fontSize:32, fontWeight:600, color:'var(--amber)' }}>₹{totalPending.toLocaleString('en-IN')}</div>
            <div style={{ fontSize:12, color:'var(--text2)', marginTop:4 }}>{pending.length} challan{pending.length>1?'s':''} awaiting payment</div>
          </div>
          <div style={{ fontSize:13, color:'var(--text3)', maxWidth:260 }}>
            ⚠️ Unpaid challans may result in license point deduction and increased scrutiny.
          </div>
        </div>
      )}

      {/* Pending challans */}
      {pending.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'var(--amber)' }}>⏳ Pending ({pending.length})</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {pending.map(v => <ChallanCard key={v.id} v={v} onPay={handlePay} paying={paying===v.id} />)}
          </div>
        </div>
      )}

      {/* Paid challans */}
      {paid.length > 0 && (
        <div>
          <h2 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'var(--text2)' }}>✅ Paid ({paid.length})</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {paid.map(v => <ChallanCard key={v.id} v={v} paid />)}
          </div>
        </div>
      )}

      {!loading && violations.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text3)' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
          <p style={{ fontSize:14, fontWeight:500 }}>No challans found!</p>
          <p style={{ fontSize:12, marginTop:4 }}>You're driving clean. Keep it up.</p>
        </div>
      )}
    </div>
  );
}

function ChallanCard({ v, onPay, paying, paid }) {
  return (
    <div style={{ background:'var(--bg2)', border:`1px solid ${paid ? 'var(--border)' : 'rgba(255,184,0,0.18)'}`, borderRadius:12, padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <span className="font-mono" style={{ fontSize:11, color:'var(--text3)' }}>{v.challanNumber}</span>
          <ViolationBadge type={v.type} />
        </div>
        <div style={{ fontSize:13, color:'var(--text2)', marginBottom:2 }}>📍 {v.location || 'Auto-detected'} · {v.source}</div>
        <div style={{ fontSize:11, color:'var(--text3)' }}>
          {new Date(v.timestamp).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}
          {v.paidAt && ` · Paid: ${new Date(v.paidAt).toLocaleDateString('en-IN')}`}
        </div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div className="font-mono" style={{ fontSize:22, fontWeight:600, color: paid ? '#22C55E' : 'var(--amber)', marginBottom:6 }}>
          ₹{v.fine?.toLocaleString('en-IN')}
        </div>
        {!paid && onPay && (
          <button onClick={() => onPay(v.id)} disabled={paying}
            style={{ padding:'8px 18px', borderRadius:8, background:'var(--amber)', color:'#000', border:'none', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s', opacity: paying ? 0.6 : 1 }}>
            {paying ? 'Processing…' : '💳 Pay Now'}
          </button>
        )}
        {paid && <span style={{ fontSize:12, color:'#22C55E', fontWeight:600 }}>✓ Cleared</span>}
      </div>
    </div>
  );
}
