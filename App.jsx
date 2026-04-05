// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from 'useAuth';
import { ToastProvider } from 'useToast';

import LandingPage from 'LandingPage';
import LoginPage from 'LoginPage';
import OperatorDashboard from 'OperatorDashboard';
import CitizenDashboard from 'CitizenDashboard';

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/operator/*"
              element={
                <ProtectedRoute role="operator">
                  <OperatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/*"
              element={
                <ProtectedRoute role="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
