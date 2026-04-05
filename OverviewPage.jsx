// src/pages/operator/OverviewPage.jsx
import { useState, useEffect, useRef } from 'react';
import { getAnalytics, createViolation, createEmergency } from '../../utils/api';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/StatCard';
import ViolationBadge from '../../components/ViolationBadge';

const VIOL_TYPES = ['helmet','seatbelt','signal','speed'];
const LOCATIONS = ['NH-46 Near Toll','DB Road Junction','Ring Road Km 12','AIIMS Bhopal Junction','MP Nagar Square'];

function ts() { return new Date().toLocaleTimeString('en-IN',{hour12:false}); }

export default function OverviewPage() {
  const toast = useToast();
  const [stats, setStats] = useState({ summary:{totalViolations:0,totalFines:0,totalEmergencies:0,pendingViolations:0}, byType:{}, recentViolations:[], recentEmergencies:[] });
  const [logs, setLogs]   = useState([{ t: ts(), msg: 'SafeRoad AI v2.0 — system initialized', col: 'var(--teal)' }]);
  const [autoOn, setAutoOn] = useState(true);
  const autoRef = useRef(null);

  async function fetchStats() {
    try { const r = await getAnalytics(); setStats(r.data); } catch {}
  }

  function addLog(msg, col='var(--teal)') {
    setLogs(prev => [{ t: ts(), msg, col }, ...prev].slice(0,12));
  }

  async function fireViolation() {
    const type = VIOL_TYPES[Math.floor(Math.random()*4)];
    try {
      await createViolation({ type });
      addLog(`Challan: ${type.toUpperCase()} — auto-generated`, type==='helmet'?'var(--red)':type==='signal'?'var(--amber)':'var(--purple)');
      fetchStats();
    } catch {}
  }

  async function fireEmergency() {
    try {
      await createEmergency({});
      addLog(`EMERGENCY: ${LOCATIONS[Math.floor(Math.random()*5)]} — GPS dispatched`, 'var(--red)');
      fetchStats();
      toast.error('🚨 Emergency alert dispatched!');
    } catch {}
  }

  function startAuto() {
    autoRef.current = setInterval(() => {
      if (Math.random() > 0.42) fireViolation();
      if (Math.random() > 0.88) fireEmergency();
    }, 2800);
  }
  function stopAuto() { clearInterval(autoRef.current); }

  useEffect(() => {
    fetchStats();
    startAuto();
    return () => stopAuto();
  }, []);

  function toggleAuto() {
    if (autoOn) { stopAuto(); setAutoOn(false); toast.info('Auto-simulation paused'); }
    else         { startAuto(); setAutoOn(true); toast.success('Auto-simulation resumed'); }
  }

  const { summary, byType, recentViolations, recentEmergencies } = stats;

  return (
    <div style={{ padding: '28px 28px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Command Overview</h1>
          <p style={{ fontSize:13, color:'var(--text2)' }}>Live road safety monitoring dashboard</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'var(--text2)', background:'var(--bg2)', border:'1px solid var(--border)', padding:'7px 14px', borderRadius:9 }}>
            <span className="live-dot" style={{ background: autoOn ? 'var(--teal)' : 'var(--text3)' }} />
            {autoOn ? 'Live Simulation' : 'Paused'}
          </div>
          <button className="btn btn-ghost" style={{ fontSize:12 }} onClick={toggleAuto}>{autoOn ? '⏸ Pause' : '▶ Resume'}</button>
          <button className="btn" style={{ background:'var(--red-dim)', color:'var(--red)', border:'1px solid rgba(255,71,87,0.2)', fontSize:12 }} onClick={fireEmergency}>🚨 Alert</button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        <StatCard icon="⚠️" label="Total Violations" value={summary.totalViolations} sub="Today's detections" color="var(--red)" />
        <StatCard icon="💸" label="Total Fines" value={'₹'+(summary.totalFines||0).toLocaleString('en-IN')} sub="Revenue collected" color="var(--amber)" />
        <StatCard icon="🚨" label="Emergencies" value={summary.totalEmergencies} sub="GPS dispatched" color="var(--purple)" />
        <StatCard icon="⏳" label="Pending" value={summary.pendingViolations} sub="Awaiting payment" color="var(--blue)" />
      </div>

      {/* Two-column layout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Recent Violations */}
        <div className="card" style={{ padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ fontSize:14, fontWeight:600 }}>Recent Challans</h3>
            <span style={{ fontSize:11, color:'var(--text3)' }}>{summary.totalViolations} total</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {recentViolations.length === 0 && <p style={{ fontSize:13, color:'var(--text3)', textAlign:'center', padding:'20px 0' }}>No violations yet. Simulation running…</p>}
            {recentViolations.map(v => (
              <div key={v.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'var(--bg3)', borderRadius:9, animation:'slideIn 0.3s ease' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                  <span className="font-mono" style={{ fontSize:12, fontWeight:500 }}>{v.vehiclePlate}</span>
                  <ViolationBadge type={v.type} />
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--amber)' }}>₹{v.fine?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize:10, color:'var(--text3)' }}>{new Date(v.timestamp).toLocaleTimeString('en-IN',{hour12:false})}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Violation breakdown */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Violation Breakdown</h3>
          {[
            { key:'helmet',  label:'No Helmet',    col:'var(--red)',    fine:1000 },
            { key:'seatbelt',label:'No Seatbelt',  col:'var(--teal)',   fine:1000 },
            { key:'signal',  label:'Signal Jump',  col:'var(--amber)',  fine:5000 },
            { key:'speed',   label:'Overspeeding', col:'var(--purple)', fine:2000 },
          ].map(v => {
            const cnt = byType[v.key] || 0;
            const total = Object.values(byType).reduce((a,b)=>a+b,0) || 1;
            const pct = Math.round((cnt/total)*100);
            return (
              <div key={v.key} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span style={{ color:'var(--text2)' }}>{v.label}</span>
                  <span style={{ color:v.col, fontWeight:600 }}>{cnt} ({pct}%)</span>
                </div>
                <div style={{ height:6, background:'var(--bg4)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:v.col, borderRadius:3, transition:'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}

          {/* Emergency feed */}
          <h3 style={{ fontSize:14, fontWeight:600, margin:'20px 0 12px' }}>Emergency Alerts</h3>
          {recentEmergencies.length === 0 && <p style={{ fontSize:12, color:'var(--text3)' }}>No active emergencies.</p>}
          {recentEmergencies.map(e => (
            <div key={e.id} style={{ background:'rgba(255,71,87,0.08)', border:'1px solid rgba(255,71,87,0.2)', borderRadius:9, padding:'10px 12px', marginBottom:8 }}>
              <div style={{ fontSize:12, color:'var(--red)', fontWeight:600, marginBottom:3 }}>🔴 {new Date(e.timestamp).toLocaleTimeString('en-IN',{hour12:false})}</div>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>Accident Detected — {e.location}</div>
              <div style={{ fontSize:11, color:'var(--text3)' }}>GPS dispatched · ETA: {e.eta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="card" style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <h3 style={{ fontSize:14, fontWeight:600 }}>Activity Log</h3>
          <span style={{ fontSize:11, color:'var(--text3)' }}>{logs.length} events</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:220, overflowY:'auto' }}>
          {logs.map((l,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, padding:'5px 0', borderBottom:'1px solid var(--border)' }}>
              <span className="font-mono" style={{ color:'var(--text3)', flexShrink:0 }}>{l.t}</span>
              <span style={{ width:6, height:6, borderRadius:'50%', background:l.col, flexShrink:0 }} />
              <span style={{ color:'var(--text2)' }}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
