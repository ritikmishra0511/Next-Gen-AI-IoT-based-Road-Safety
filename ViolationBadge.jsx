// src/components/ViolationBadge.jsx
const TYPE_MAP = {
  helmet:  { label: 'No Helmet',   color: '#FF4757', bg: 'rgba(255,71,87,0.12)'   },
  seatbelt:{ label: 'No Seatbelt', color: '#00E5C0', bg: 'rgba(0,229,192,0.12)'   },
  signal:  { label: 'Signal Jump', color: '#FFB800', bg: 'rgba(255,184,0,0.12)'   },
  speed:   { label: 'Overspeeding',color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)'  },
};

export default function ViolationBadge({ type }) {
  const t = TYPE_MAP[type] || { label: type, color: 'var(--text2)', bg: 'var(--bg4)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: t.bg, color: t.color, border: `1px solid ${t.color}33`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
      {t.label}
    </span>
  );
}
