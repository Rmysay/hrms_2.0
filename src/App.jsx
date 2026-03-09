import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Organization from './pages/Organization/Organization';
import TalentManagement from './pages/Talent/TalentManagement';
import Recruitment from './pages/Recruitment/Recruitment';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { loadUser } from './store/authSlice';

/* Placeholder component for routes not yet implemented */
function ComingSoon({ title }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Bu modül yakında aktif olacak.
      </p>
    </div>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/talent" element={<TalentManagement />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/performance" element={<ComingSoon title="Performans & Ödül" />} />
        <Route path="/employees" element={<ComingSoon title="Çalışan Paneli" />} />
        <Route path="/reports" element={<ComingSoon title="Raporlar & Analitik" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
