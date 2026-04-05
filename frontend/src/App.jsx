import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayoutShadcn from './components/AdminLayoutShadcn';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/laporan" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Laporan />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/buat-laporan" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <BuatLaporan />
              </main>
              <Footer />
            </div>
          } />
          
          <Route path="/login" element={<Login />} />

          {/* Admin Routes with AdminLayoutShadcn */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin_dlh']}>
                <AdminLayoutShadcn>
                  <DashboardDLH />
                </AdminLayoutShadcn>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/laporan"
            element={
              <ProtectedRoute allowedRoles={['admin_dlh']}>
                <AdminLayoutShadcn>
                  <KelolaLaporan />
                </AdminLayoutShadcn>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/petugas"
            element={
              <ProtectedRoute allowedRoles={['admin_dlh']}>
                <AdminLayoutShadcn>
                  <KelolaPetugas />
                </AdminLayoutShadcn>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/statistik"
            element={
              <ProtectedRoute allowedRoles={['admin_dlh']}>
                <AdminLayoutShadcn>
                  <DashboardDLH />
                </AdminLayoutShadcn>
              </ProtectedRoute>
            }
          />

          {/* Petugas Routes */}
          <Route
            path="/petugas/dashboard"
            element={
              <ProtectedRoute allowedRoles={['petugas']}>
                <AdminLayoutShadcn>
                  <DashboardPetugas />
                </AdminLayoutShadcn>
              </ProtectedRoute>
            }
          />

          {/* Legacy /dashboard route - redirect based on role */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

