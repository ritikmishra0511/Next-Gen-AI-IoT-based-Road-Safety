// src/pages/OperatorDashboard.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OverviewPage from './operator/OverviewPage';
import ViolationsPage from './operator/ViolationsPage';
import EmergencyPage from './operator/EmergencyPage';
import IoTPage from './operator/IoTPage';
import AnalyticsPage from './operator/AnalyticsPage';

const NAV = [
  { to: '/operator',            label: 'Overview',    icon: '📊', end: true },
  { to: '/operator/violations', label: 'Violations',  icon: '⚠️' },
  { to: '/operator/emergency',  label: 'Emergency',   icon: '🚨' },
  { to: '/operator/iot',        label: 'IoT Control', icon: '🔌' },
  { to: '/operator/analytics',  label: 'Analytics',   icon: '📈' },
];

export default function OperatorDashboard() {
  return (
    <div className="sidebar-layout">
      <Sidebar items={NAV} role="Traffic Operator" />
      <div className="main-content">
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="violations" element={<ViolationsPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="iot" element={<IoTPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/operator" replace />} />
        </Routes>
      </div>
    </div>
  );
}
