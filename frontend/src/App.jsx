import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Laporan from './pages/Laporan';
import BuatLaporan from './pages/BuatLaporan';
import Login from './pages/Login';

// Admin DLH Pages
import DashboardDLH from './pages/admin/DashboardDLH';
import KelolaLaporan from './pages/admin/KelolaLaporan';
import KelolaPetugas from './pages/admin/KelolaPetugas';

// Petugas Pages
import DashboardPetugas from './pages/petugas/DashboardPetugas';

function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === 'admin_dlh') {
    return <DashboardDLH />;
  } else if (user?.role === 'petugas') {
    return <DashboardPetugas />;
  }

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/laporan" element={<Laporan />} />
              <Route path="/buat-laporan" element={<BuatLaporan />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes - Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin_dlh', 'petugas']}>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin DLH Only */}
              <Route
                path="/dashboard/laporan"
                element={
                  <ProtectedRoute allowedRoles={['admin_dlh']}>
                    <KelolaLaporan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/petugas"
                element={
                  <ProtectedRoute allowedRoles={['admin_dlh']}>
                    <KelolaPetugas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/statistik"
                element={
                  <ProtectedRoute allowedRoles={['admin_dlh']}>
                    <DashboardDLH />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

