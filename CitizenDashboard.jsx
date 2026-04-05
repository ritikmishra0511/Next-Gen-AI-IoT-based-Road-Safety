// src/pages/CitizenDashboard.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CitizenHome from './citizen/CitizenHome';
import CitizenChallans from './citizen/CitizenChallans';
import CitizenVehicle from './citizen/CitizenVehicle';
import CitizenSafety from './citizen/CitizenSafety';

const NAV = [
  { to:'/citizen',          label:'My Dashboard', icon:'🏠', end:true },
  { to:'/citizen/challans', label:'My Challans',  icon:'📋' },
  { to:'/citizen/vehicle',  label:'Vehicle Info',  icon:'🚗' },
  { to:'/citizen/safety',   label:'Safety Tips',   icon:'🛡️' },
];

export default function CitizenDashboard() {
  return (
    <div className="sidebar-layout">
      <Sidebar items={NAV} role="Citizen Portal" />
      <div className="main-content">
        <Routes>
          <Route index element={<CitizenHome />} />
          <Route path="challans" element={<CitizenChallans />} />
          <Route path="vehicle" element={<CitizenVehicle />} />
          <Route path="safety" element={<CitizenSafety />} />
          <Route path="*" element={<Navigate to="/citizen" replace />} />
        </Routes>
      </div>
    </div>
  );
}
