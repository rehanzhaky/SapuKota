import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../../services/api';

const DashboardDLH = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  const statusData = stats?.reportsByStatus || [];
  const categoryData = stats?.reportsByCategory || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Admin DLH</h1>
          <p className="text-gray-600">Selamat datang di panel administrasi Dinas Lingkungan Hidup</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Laporan</p>
                <p className="text-3xl font-bold">{stats?.totalReports || 0}</p>
              </div>
              <div className="text-5xl opacity-50">📊</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm mb-1">Menunggu Review</p>
                <p className="text-3xl font-bold">{stats?.pendingReports || 0}</p>
              </div>
              <div className="text-5xl opacity-50">⏳</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Dalam Proses</p>
                <p className="text-3xl font-bold">{stats?.inProgressReports || 0}</p>
              </div>
              <div className="text-5xl opacity-50">🚛</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Selesai Bulan Ini</p>
                <p className="text-3xl font-bold">{stats?.completedThisMonth || 0}</p>
              </div>
              <div className="text-5xl opacity-50">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/dashboard/laporan" className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kelola Laporan</h3>
              <p className="text-gray-600">Review dan assign laporan ke petugas</p>
            </div>
          </Link>

          <Link to="/dashboard/petugas" className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kelola Petugas</h3>
              <p className="text-gray-600">Tambah, edit, dan hapus data petugas</p>
            </div>
          </Link>

          <Link to="/dashboard/statistik" className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Statistik & Laporan</h3>
              <p className="text-gray-600">Lihat performa dan analisis data</p>
            </div>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Laporan per Status</h3>
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{item.status}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-48 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-500 h-3 rounded-full" 
                        style={{ width: `${(item.count / stats.totalReports) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-800 w-12 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Laporan per Kategori</h3>
            <div className="space-y-3">
              {categoryData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{item.category.replace(/_/g, ' ')}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-48 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-secondary-500 h-3 rounded-full" 
                        style={{ width: `${(item.count / stats.totalReports) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-800 w-12 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDLH;

