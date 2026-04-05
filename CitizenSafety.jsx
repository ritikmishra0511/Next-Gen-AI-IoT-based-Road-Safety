// src/pages/citizen/CitizenSafety.jsx
const TIPS = [
  { icon:'🪖', title:'Always Wear a Helmet', body:'India mandates ISI-certified helmets. Our system blocks engine ignition without a helmet — a life-saving hardware control.', col:'var(--red)' },
  { icon:'🪢', title:'Fasten Your Seatbelt', body:'Seatbelts reduce ejection-related fatalities by ~45%. Our interlock system prevents vehicle startup if seatbelts are unfastened.', col:'var(--teal)' },
  { icon:'🚦', title:'Obey Traffic Signals', body:'Signal jumping is detected in real-time by AI cameras at 45+ FPS. A ₹5000 challan is auto-generated instantly.', col:'var(--amber)' },
  { icon:'💨', title:'Stay Within Speed Limits', body:'Overspeeding detection uses YOLO v8 at 95%+ accuracy. Repeat offenders face license point deduction.', col:'var(--purple)' },
  { icon:'📱', title:'No Phone While Driving', body:'Distracted driving causes 21% of accidents. Stay focused — save lives.', col:'var(--blue)' },
  { icon:'🌧️', title:'Drive Cautiously in Rain', body:'Wet roads increase braking distance by 3x. Reduce speed and maintain safe following distance.', col:'var(--teal)' },
];

const SYSTEM = [
  { icon:'🔒', title:'Prevention Layer', body:'Helmet & seatbelt ignition locks built on Arduino. Engine simply won\'t start without compliance.' },
  { icon:'👁️', title:'Detection Layer', body:'YOLO v8 AI detects helmet, seatbelt, signal & speed violations at 45+ FPS with <100ms latency.' },
  { icon:'📋', title:'Enforcement Layer', body:'Auto e-challans linked to VAHAN/Sarathi. Zero human discretion eliminates corruption.' },
  { icon:'🚑', title:'Response Layer', body:'Crash sensors + GPS dispatch emergency services in under 2 seconds. 40% faster response.' },
  { icon:'🗺️', title:'Intelligence Layer', body:'ML-based black spot mapping and risk scoring for city policymakers.' },
  { icon:'🚦', title:'Optimization Layer', body:'AI signal control and emergency vehicle prioritization for safer, smarter roads.' },
];

export default function CitizenSafety() {
  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:900 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Safety Guide</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>Road safety tips & how SafeRoad AI protects you</p>
      </div>

      {/* Safety tips */}
      <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>🛡️ Safe Driving Tips</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
        {TIPS.map((t,i) => (
          <div key={i} className="card" style={{ padding:'18px 20px', borderLeft:`3px solid ${t.col}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:22 }}>{t.icon}</span>
              <span style={{ fontSize:14, fontWeight:600 }}>{t.title}</span>
            </div>
            <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.65 }}>{t.body}</p>
          </div>
        ))}
      </div>

      {/* System layers */}
      <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>⚙️ How SafeRoad AI Works</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:28 }}>
        {SYSTEM.map((s,i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 16px' }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>{s.title}</div>
            <p style={{ fontSize:11, color:'var(--text2)', lineHeight:1.6 }}>{s.body}</p>
          </div>
        ))}
      </div>

      {/* Impact */}
      <div style={{ background:'linear-gradient(135deg,rgba(0,229,192,0.06),rgba(59,130,246,0.04))', border:'1px solid rgba(0,229,192,0.15)', borderRadius:16, padding:24 }}>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>📊 Expected Impact</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {[
            { val:'60%', label:'Reduction in helmet violations', col:'var(--teal)' },
            { val:'40%', label:'Faster emergency response',      col:'var(--blue)' },
            { val:'30%', label:'Reduction in road fatalities',   col:'var(--purple)' },
            { val:'₹2400Cr', label:'Annual savings per metro city', col:'var(--amber)' },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div className="font-display" style={{ fontSize:28, fontWeight:800, color:s.col, marginBottom:6 }}>{s.val}</div>
              <div style={{ fontSize:11, color:'var(--text2)', lineHeight:1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:18, fontSize:12, color:'var(--text3)', textAlign:'center' }}>
          By Mahima Sharma · Ritik Mishra · Vivek Kumar Mishra
        </div>
      </div>
    </div>
  );
}
