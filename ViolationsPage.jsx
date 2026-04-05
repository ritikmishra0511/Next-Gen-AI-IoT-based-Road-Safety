// src/pages/operator/ViolationsPage.jsx
import { useState, useEffect } from 'react';
import { getViolations, createViolation, payViolation } from '../../utils/api';
import { useToast } from '../../hooks/useToast';
import ViolationBadge from '../../components/ViolationBadge';

const TYPES = ['all','helmet','seatbelt','signal','speed'];

export default function ViolationsPage() {
  const toast = useToast();
  const [violations, setViolations] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (search) params.vehicle = search;
      const r = await getViolations(params);
      setViolations(r.data.violations);
      setTotal(r.data.total);
    } catch { toast.error('Failed to load violations'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filterType, search]);

  async function handleCreate(type) {
    setCreating(true);
    try {
      await createViolation({ type });
      toast.success(`Challan created: ${type}`);
      load();
    } catch { toast.error('Failed to create violation'); }
    finally { setCreating(false); }
  }

  async function handlePay(id) {
    try {
      await payViolation(id);
      toast.success('Fine marked as paid');
      load();
    } catch { toast.error('Failed to update status'); }
  }

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:1100 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Violations & Challans</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>{total} total violations recorded</p>
      </div>

      {/* Quick create buttons */}
      <div className="card" style={{ padding:16, marginBottom:20 }}>
        <div style={{ fontSize:12, color:'var(--text3)', fontWeight:600, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.5px' }}>Quick Challan</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[
            { type:'helmet',   label:'🪖 No Helmet',   col:'var(--red)'    },
            { type:'seatbelt', label:'🪢 No Seatbelt', col:'var(--teal)'   },
            { type:'signal',   label:'🚦 Signal Jump', col:'var(--amber)'  },
            { type:'speed',    label:'💨 Overspeeding',col:'var(--purple)' },
          ].map(v => (
            <button key={v.type} disabled={creating} onClick={() => handleCreate(v.type)}
              style={{ padding:'8px 16px', borderRadius:9, border:`1px solid ${v.col}33`, background:`${v.col}11`, color:v.col, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
        <input className="input" style={{ flex:1, minWidth:180, maxWidth:280 }} placeholder="🔍 Search by plate number…" value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display:'flex', gap:6 }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              style={{ padding:'8px 14px', borderRadius:8, border:'1px solid var(--border)', background: filterType===t ? 'var(--bg4)' : 'transparent', color: filterType===t ? 'var(--text)' : 'var(--text2)', fontSize:12, fontWeight:500, cursor:'pointer', textTransform:'capitalize', transition:'all 0.15s' }}>
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Challan No.','Vehicle','Type','Fine','Source','Status','Time','Action'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:13 }}>Loading…</td></tr>
              )}
              {!loading && violations.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:13 }}>No violations found</td></tr>
              )}
              {violations.map(v => (
                <tr key={v.id} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={{ padding:'12px 16px' }}>
                    <span className="font-mono" style={{ fontSize:11, color:'var(--text3)' }}>{v.challanNumber?.slice(-8)}</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <span className="font-mono" style={{ fontSize:13, fontWeight:500 }}>{v.vehiclePlate}</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}><ViolationBadge type={v.type} /></td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--amber)' }}>₹{v.fine?.toLocaleString('en-IN')}</span>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text2)' }}>{v.source}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:20,
                      background: v.status==='paid' ? 'rgba(34,197,94,0.12)' : 'rgba(255,184,0,0.12)',
                      color: v.status==='paid' ? '#22C55E' : 'var(--amber)',
                      border: `1px solid ${v.status==='paid' ? 'rgba(34,197,94,0.25)' : 'rgba(255,184,0,0.25)'}` }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:11, color:'var(--text3)', whiteSpace:'nowrap' }}>
                    {new Date(v.timestamp).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'})}
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    {v.status !== 'paid' && (
                      <button onClick={() => handlePay(v.id)}
                        style={{ fontSize:11, padding:'5px 11px', borderRadius:7, border:'1px solid rgba(34,197,94,0.25)', background:'rgba(34,197,94,0.1)', color:'#22C55E', cursor:'pointer', fontWeight:600 }}>
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
