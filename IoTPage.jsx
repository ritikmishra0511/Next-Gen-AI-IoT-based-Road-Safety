// src/pages/operator/IoTPage.jsx
import { useState, useEffect } from 'react';
import { sendHelmetEvent, sendRfidEvent, resetIot, getIotStatus } from '../../utils/api';
import { useToast } from '../../hooks/useToast';

function ts() { return new Date().toLocaleTimeString('en-IN',{hour12:false}); }

export default function IoTPage() {
  const toast = useToast();
  const [state, setState] = useState({ helmet:false, rfid:null, engineEnabled:false });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState('');

  function addLog(msg, col='var(--teal)') {
    setLogs(prev => [{ t:ts(), msg, col }, ...prev].slice(0,20));
  }

  async function load() {
    try { const r = await getIotStatus(); setState(r.data); } catch {}
  }

  useEffect(() => {
    load();
    addLog('IoT system initialized — awaiting sensor inputs', 'var(--teal)');
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  async function helmetOn() {
    setLoading('hon');
    try {
      const r = await sendHelmetEvent({ detected:true, confidence:94, deviceId:'CAM-01' });
      setState(prev => ({ ...prev, helmet:true, engineEnabled:r.data.engineEnabled }));
      addLog('AI: Helmet detected — confidence 94%', 'var(--purple)');
      toast.success('🪖 Helmet detected by AI camera!');
      if (r.data.engineEnabled) addLog('ENGINE STARTED — all checks passed', 'var(--teal)');
    } catch { toast.error('IoT request failed'); }
    finally { setLoading(''); }
  }

  async function helmetOff() {
    setLoading('hoff');
    try {
      const r = await sendHelmetEvent({ detected:false, confidence:0, deviceId:'CAM-01' });
      setState(prev => ({ ...prev, helmet:false, engineEnabled:false }));
      addLog('AI: No helmet detected — engine blocked!', 'var(--red)');
      toast.error('⛔ No helmet — engine blocked!');
    } catch { toast.error('IoT request failed'); }
    finally { setLoading(''); }
  }

  async function rfidScan() {
    setLoading('rfid');
    try {
      const r = await sendRfidEvent({ cardId:'822AE15C', vehiclePlate:'MP09CD5678', deviceId:'RFID-01' });
      setState(prev => ({ ...prev, rfid:'822AE15C', engineEnabled:r.data.engineEnabled }));
      addLog('RFID: 822AE15C — card verified ✓', 'var(--teal)');
      toast.success('✅ Valid RFID card detected!');
      if (r.data.engineEnabled) addLog('ENGINE STARTED — all checks passed', 'var(--teal)');
    } catch { toast.error('IoT request failed'); }
    finally { setLoading(''); }
  }

  async function rfidRemove() {
    setLoading('rfidoff');
    try {
      await sendRfidEvent({ cardId:null, deviceId:'RFID-01' });
      setState(prev => ({ ...prev, rfid:null, engineEnabled:false }));
      addLog('RFID: card removed — engine locked', 'var(--amber)');
      toast.warning('⚠️ RFID removed — engine locked');
    } catch { toast.error('IoT request failed'); }
    finally { setLoading(''); }
  }

  async function handleReset() {
    setLoading('reset');
    try {
      const r = await resetIot();
      setState(r.data);
      setLogs([]);
      addLog('System reset — all sensors cleared', 'var(--text3)');
      toast.info('🔄 System reset');
    } catch { toast.error('Reset failed'); }
    finally { setLoading(''); }
  }

  const Check = ({ ok, label }) => (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--bg3)', borderRadius:9 }}>
      <div style={{ width:28, height:28, borderRadius:8, background: ok ? 'rgba(0,229,192,0.15)' : 'rgba(255,71,87,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
        {ok ? '✓' : '✕'}
      </div>
      <span style={{ fontSize:13, color: ok ? 'var(--teal)' : 'var(--red)', fontWeight:600 }}>{label}</span>
    </div>
  );

  return (
    <div style={{ padding:'28px 28px 40px', maxWidth:960 }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="font-display" style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>IoT Control Panel</h1>
        <p style={{ fontSize:13, color:'var(--text2)' }}>Helmet ignition lock · RFID authentication · Real-time sensor control</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Engine status */}
        <div style={{ background: state.engineEnabled ? 'rgba(0,229,192,0.06)' : 'rgba(255,71,87,0.06)', border:`1px solid ${state.engineEnabled ? 'rgba(0,229,192,0.25)' : 'rgba(255,71,87,0.2)'}`, borderRadius:14, padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background: state.engineEnabled ? 'var(--teal)' : 'var(--red)', boxShadow:`0 0 10px ${state.engineEnabled ? 'rgba(0,229,192,0.6)' : 'rgba(255,71,87,0.4)'}` }} />
            <span className="font-display" style={{ fontSize:18, fontWeight:700, color: state.engineEnabled ? 'var(--teal)' : 'var(--red)' }}>
              Engine: {state.engineEnabled ? 'RUNNING' : 'OFFLINE'}
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            <Check ok={!!state.rfid}   label={state.rfid   ? `RFID: ${state.rfid}` : 'RFID: Not scanned'} />
            <Check ok={state.helmet}   label={state.helmet ? 'Helmet: Detected (94%)' : 'Helmet: Not detected'} />
            <Check ok={state.engineEnabled} label={state.engineEnabled ? 'Relay: Active' : 'Relay: Blocked'} />
          </div>
          <p style={{ fontSize:12, color:'var(--text3)' }}>
            {state.engineEnabled ? 'RFID authenticated + helmet detected — relay active' :
             state.rfid ? 'Card verified — awaiting helmet detection…' :
             'Awaiting RFID card scan…'}
          </p>
        </div>

        {/* Controls */}
        <div className="card" style={{ padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Sensor Controls</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <CtrlBtn icon="🪖" label="Helmet ON" color="var(--teal)" onClick={helmetOn} loading={loading==='hon'} disabled={state.helmet} />
            <CtrlBtn icon="❌" label="Helmet OFF" color="var(--red)" onClick={helmetOff} loading={loading==='hoff'} disabled={!state.helmet} />
            <CtrlBtn icon="💳" label="Scan RFID" color="var(--blue)" onClick={rfidScan} loading={loading==='rfid'} disabled={!!state.rfid} />
            <CtrlBtn icon="🔒" label="Remove RFID" color="var(--amber)" onClick={rfidRemove} loading={loading==='rfidoff'} disabled={!state.rfid} />
          </div>
          <div style={{ marginTop:12 }}>
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', fontSize:12 }} onClick={handleReset} disabled={loading==='reset'}>
              🔄 Reset All Sensors
            </button>
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="card" style={{ padding:20, marginBottom:16 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Hardware Flow</h3>
        <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto' }}>
          {[
            { icon:'💳', label:'RFID Sensor', sub:'Arduino Uno', col:'var(--blue)' },
            { arrow:true },
            { icon:'🪖', label:'Helmet Sensor', sub:'Pressure/Reed', col:'var(--purple)' },
            { arrow:true },
            { icon:'⚡', label:'Relay Module', sub:'12V Ignition', col:'var(--amber)' },
            { arrow:true },
            { icon:'🏍️', label:'Engine', sub:'Controlled', col:state.engineEnabled?'var(--teal)':'var(--red)' },
          ].map((item,i) =>
            item.arrow
              ? <div key={i} style={{ padding:'0 8px', color:'var(--text3)', fontSize:18, flexShrink:0 }}>→</div>
              : <div key={i} style={{ textAlign:'center', padding:'12px 16px', background:'var(--bg3)', borderRadius:10, flexShrink:0, minWidth:100, border:`1px solid ${item.col}22` }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{item.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:item.col }}>{item.label}</div>
                  <div style={{ fontSize:10, color:'var(--text3)' }}>{item.sub}</div>
                </div>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="card" style={{ padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <h3 style={{ fontSize:14, fontWeight:600 }}>Sensor Log</h3>
          <button onClick={() => setLogs([])} style={{ fontSize:11, color:'var(--text3)', background:'none', border:'none', cursor:'pointer' }}>Clear</button>
        </div>
        <div style={{ maxHeight:220, overflowY:'auto', display:'flex', flexDirection:'column', gap:5 }}>
          {logs.length === 0 && <p style={{ fontSize:12, color:'var(--text3)' }}>No sensor events yet.</p>}
          {logs.map((l,i) => (
            <div key={i} style={{ display:'flex', gap:10, fontSize:12, padding:'5px 0', borderBottom:'1px solid var(--border)' }}>
              <span className="font-mono" style={{ color:'var(--text3)', flexShrink:0 }}>{l.t}</span>
              <span style={{ width:6, height:6, borderRadius:'50%', background:l.col, flexShrink:0, marginTop:4 }} />
              <span style={{ color:'var(--text2)' }}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ icon, label, color, onClick, loading, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, padding:'14px', borderRadius:10, border:`1px solid ${color}25`, background:`${color}0D`, color, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition:'all 0.15s', fontSize:12, fontWeight:600 }}>
      <span style={{ fontSize:22 }}>{loading ? '⟳' : icon}</span>
      {label}
    </button>
  );
}
