// src/components/StatCard.jsx
export default function StatCard({ icon, label, value, sub, color = 'var(--teal)', trend }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
        {trend !== undefined && (
          <span style={{ fontSize: 11, color: trend >= 0 ? 'var(--teal)' : 'var(--red)', background: trend >= 0 ? 'var(--teal-dim)' : 'var(--red-dim)', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-mono" style={{ fontSize: 28, fontWeight: 600, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)' }}>{sub}</div>}
    </div>
  );
}
