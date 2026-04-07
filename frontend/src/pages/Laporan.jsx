import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import MapView from '../components/MapView';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Laporan = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalReports: 0
  });

  useEffect(() => {
    fetchReports();
    
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchReports();
    }, 10000);

    return () => clearInterval(interval);
  }, [filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 9,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      };
      
      const response = await reportsAPI.getAll(params);
      setReports(response.data.reports);
      setPagination({
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalReports: response.data.totalReports
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to page 1 when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Laporan Sampah Liar</h1>
          <p className="text-lg text-green-50 mb-6">
            Lihat semua laporan dari masyarakat dan pantau progres penanganan
          </p>
          <Link
            to="/buat-laporan"
            className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buat Laporan Baru
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari lokasi atau deskripsi..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="pending,approved,assigned,in_progress">Diproses</option>
                <option value="completed">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-sm text-gray-600">
              Menampilkan {reports.length} dari {pagination.totalReports} laporan
              <span className="ml-2 text-green-600 font-medium">• Live Update</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Loading />
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Laporan</h3>
            <p className="text-gray-500 mb-6">Belum ada laporan yang sesuai dengan filter Anda</p>
            <Link
              to="/buat-laporan"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Buat Laporan Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* MAP SECTION */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Peta Lokasi Laporan</h2>
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <MapView 
                    reports={reports} 
                    colorBy="status" 
                    showTPS={false}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-sm">
                  <div className="flex items-center justify-center gap-2 bg-red-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-red-700">Pending</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-cyan-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="font-medium text-cyan-700">Approved</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-purple-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-purple-700">Assigned</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-orange-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-orange-700">In Progress</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-green-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">Completed</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIST SECTION */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Laporan</h2>
            </div>
            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Photo */}
                  {report.photo ? (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={`${API_URL}/uploads/${report.photo}`}
                        alt="Foto laporan"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50" y="50" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <StatusBadge status={report.status} />
                      <span className="text-xs text-gray-500">{formatDate(report.createdAt)}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                      {report.title}
                    </h3>

                    <div className="mb-3">
                      <div className="flex items-start text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{report.location}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-3">
                      {report.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.currentPage === index + 1
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Laporan;
  