// src/pages/operator/AnalyticsPage.jsx
import { useState, useEffect } from 'react';
import { getAnalytics } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const COLORS = { helmet:'#FF4757', seatbelt:'#00E5C0', signal:'#FFB800', speed:'#8B5CF6' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', fontSize:12 }}>
      {label && <div style={{ color:'var(--text3)', marginBottom:4 }}>{label}</div>}
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color || 'var(--teal)', fontWeight:600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try { const r = await getAnalytics(); setData(r.data); }
      catch {}
      finally { setLoading(false); }
    }
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'var(--text3)', fontSize:14 }}>Loading analytics…</div>;
  if (!data) return <div style={{ padding:40, textAlign:'center', color:'var(--text3)' }}>No data available.</div>;

  const pieData = Object.entries(data.byType).map(([k,v]) => ({ name: k, value: v, color: COLORS[k] }));
  const hourlyFiltered = (data.hourly || []).filter(h => h.violations > 0 || parseInt(h.hour) < 24);
  const barData = Object.entries(data.byType).map(([k,v]) => ({ type: k.charAt(0).toUpperCase()+k.slice(1), count: v, fill: COLORS[k] }));

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:1100 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Analytics & Insights</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>AI-powered road safety intelligence</p>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Violations', value:data.summary.totalViolations, col:'var(--red)' },
          { label:'Revenue Collected', value:'₹'+(data.summary.totalFines||0).toLocaleString('en-IN'), col:'var(--amber)' },
          { label:'Emergencies', value:data.summary.totalEmergencies, col:'var(--purple)' },
          { label:'Pending Challans', value:data.summary.pendingViolations, col:'var(--blue)' },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:'16px 18px' }}>
            <div className="font-mono" style={{ fontSize:24, fontWeight:600, color:s.col, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text2)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Violation type bar chart */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Violations by Type</h3>
          {barData.every(b => b.count === 0)
            ? <p style={{ fontSize:12, color:'var(--text3)', textAlign:'center', padding:30 }}>No data yet — simulation running…</p>
            : <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barCategoryGap="35%">
                  <XAxis dataKey="type" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4,4,0,0]}>
                    {barData.map((entry,i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Pie chart */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Distribution</h3>
          {pieData.every(p => p.value === 0)
            ? <p style={{ fontSize:12, color:'var(--text3)', textAlign:'center', padding:30 }}>No violations yet.</p>
            : <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <ResponsiveContainer width="55%" height={160}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                      {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1 }}>
                  {pieData.map((p,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:p.color, flexShrink:0 }} />
                      <span style={{ color:'var(--text2)', flex:1, textTransform:'capitalize' }}>{p.name}</span>
                      <span style={{ color:p.color, fontWeight:600 }}>{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
          }
        </div>
      </div>

      {/* Hourly chart */}
      <div className="card" style={{ padding:20, marginBottom:16 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Hourly Activity (24h)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={hourlyFiltered}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" />
            <XAxis dataKey="hour" tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill:'var(--text3)', fontSize:10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="violations" stroke="var(--teal)" strokeWidth={2} dot={false} name="Violations" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top vehicles */}
      {data.topVehicles?.length > 0 && (
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Top Repeat Offenders</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {data.topVehicles.map((v,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg3)', borderRadius:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:12, color:'var(--text3)', width:20, textAlign:'right' }}>#{i+1}</span>
                  <span className="font-mono" style={{ fontSize:13, fontWeight:500 }}>{v.plate}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ height:6, width:Math.max(20, v.count*20), background:'var(--red)', borderRadius:3, opacity:0.7 }} />
                  <span style={{ fontSize:12, color:'var(--red)', fontWeight:600, width:40, textAlign:'right' }}>{v.count} violations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
