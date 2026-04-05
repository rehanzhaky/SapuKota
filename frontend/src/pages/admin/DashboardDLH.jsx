import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, reportsAPI, usersAPI } from '../../services/api';
import Loading from '../../components/Loading';
import MapView from '../../components/MapView';
import PetugasTrackingMap from '../../components/PetugasTrackingMap';
import { findNearestTPS, formatDistance } from '../../utils/distance';

const DashboardDLH = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [petugasList, setPetugasList] = useState([]);
  const [updateData, setUpdateData] = useState({
    admin_notes: '',
    assigned_to: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, reportsResponse, petugasResponse] = await Promise.all([
        statsAPI.getStats(),
        reportsAPI.getAll({ limit: 1000 }), // Get all reports for map, up to 1000
        usersAPI.getAllPetugas()
      ]);
      
      setStats(statsResponse.data);
      setPetugasList(petugasResponse.data);
      
      // Get reports array, handle different response structures
      const reportsList = reportsResponse.data.reports || reportsResponse.data || [];
      
      // Debug: Check if we have reports
      console.log('Total reports fetched:', reportsList.length);
      console.log('Reports with coordinates:', reportsList.filter(r => r.latitude && r.longitude).length);
      
      // Calculate nearest TPS and distance for each report
      const reportsWithDistance = reportsList
        .filter(report => report.latitude && report.longitude)
        .map(report => {
          const lat = parseFloat(report.latitude);
          const lng = parseFloat(report.longitude);
          const nearest = findNearestTPS(lat, lng);
          return {
            ...report,
            latitude: lat,
            longitude: lng,
            nearest_tps: nearest.name,
            distance_to_tps: nearest.distance // Keep as number for getPriority
          };
        });
      
      console.log('Reports with distance calculated:', reportsWithDistance.length);
      setReports(reportsWithDistance);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setUpdateData({
      admin_notes: report.admin_notes || '',
      assigned_to: report.assigned_to || ''
    });
    setShowReportModal(true);
  };

  const handleCloseModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
    setUpdateData({
      admin_notes: '',
      assigned_to: ''
    });
  };

  const handleUpdateReport = async () => {
    try {
      // Validation: assigned_to must be filled
      if (!updateData.assigned_to) {
        alert('Silakan pilih petugas untuk ditugaskan');
        return;
      }

      const updatePayload = {
        assigned_to: updateData.assigned_to
      };
      
      if (updateData.admin_notes) {
        updatePayload.admin_notes = updateData.admin_notes;
      }

      await reportsAPI.updateStatus(selectedReport.id, updatePayload);
      alert('Laporan berhasil ditugaskan ke petugas!');
      
      // Refresh data
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Gagal mengupdate laporan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectReport = async () => {
    try {
      const reason = prompt('Alasan penolakan laporan:');
      if (!reason) return;

      const updatePayload = {
        status: 'rejected',
        admin_notes: `Laporan ditolak: ${reason}`
      };

      await reportsAPI.updateStatus(selectedReport.id, updatePayload);
      alert('Laporan berhasil ditolak');
      
      // Refresh data
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert('Gagal menolak laporan: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <Loading />;
  }

  const statusData = stats?.reportsByStatus || [];
  const petugasData = stats?.reportsByPetugas || [];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-sm font-medium mb-2">Total Laporan</p>
          <p className="text-4xl font-bold text-gray-900">{stats?.totalReports || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-sm font-medium mb-2">Menunggu Review</p>
          <p className="text-4xl font-bold text-gray-900">{stats?.pendingReports || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-sm font-medium mb-2">Dalam Proses</p>
          <p className="text-4xl font-bold text-gray-900">{stats?.inProgressReports || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-sm font-medium mb-2">Selesai Bulan Ini</p>
          <p className="text-4xl font-bold text-gray-900">{stats?.completedThisMonth || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/laporan" className="group bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all border border-gray-200 hover:border-primary-500">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Kelola Laporan</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Review dan assign laporan ke petugas untuk ditindaklanjuti</p>
          </div>
        </Link>

        <Link to="/admin/petugas" className="group bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all border border-gray-200 hover:border-primary-500">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Kelola Petugas</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Tambah, edit, dan kelola data petugas lapangan</p>
          </div>
        </Link>

        <Link to="/admin/statistik" className="group bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all border border-gray-200 hover:border-primary-500">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">Statistik</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Lihat performa dan analisis data laporan</p>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Laporan per Status</h3>
          <div className="space-y-4">
            {statusData.length > 0 ? statusData.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize font-medium">{item.status.replace(/_/g, ' ')}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-primary-500 h-3 rounded-full transition-all" 
                      style={{ width: `${(item.count / stats.totalReports) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-800 w-12 text-right">{item.count}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">Belum ada data laporan</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Laporan per Petugas</h3>
          <div className="space-y-4">
            {petugasData.length > 0 ? petugasData.map((item) => (
              <div key={item.assigned_to} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium text-sm">
                  {item.assignedPetugas?.full_name || item.assignedPetugas?.name || `Petugas #${item.assigned_to}`}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-secondary-500 h-3 rounded-full transition-all" 
                      style={{ width: `${(item.count / stats.totalReports) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-800 w-12 text-right">{item.count}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">Belum ada laporan yang ditugaskan</p>
            )}
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-2xl shadow-md p-8 relative z-0 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Peta Sebaran Laporan & TPS</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>Klik marker laporan</strong> (merah/kuning/hijau) untuk melihat detail dan kelola laporan
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Radius merah = 500m dari TPS. Laporan di luar radius dipertimbangkan manual.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-semibold">
              {reports.length} Laporan di Peta
            </span>
            {stats?.totalReports > reports.length && (
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-medium">
                {stats.totalReports - reports.length} tanpa GPS
              </span>
            )}
          </div>
        </div>
        <div className="h-[600px] relative z-0">
          <MapView reports={reports} onReportSelect={handleReportSelect} colorBy="status" />
        </div>
      </div>

      {/* Petugas GPS Tracking Map */}
      <div className="mt-8">
        <PetugasTrackingMap />
      </div>

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Detail Laporan dari Peta</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID Laporan</p>
                  <p className="font-semibold text-gray-800">#{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Laporan</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedReport.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Current Status Badge */}
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status Saat Ini</p>
                  <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
                    selectedReport.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedReport.status === 'rejected' ? 'Ditolak' : 'Diproses'}
                  </span>
                </div>
                {selectedReport.assigned_to && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ditugaskan ke</p>
                    <span className="inline-block px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold text-sm">
                      {selectedReport.assignedPetugas?.name || `Petugas #${selectedReport.assigned_to}`}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Judul Laporan</p>
                <p className="font-semibold text-gray-800 text-lg">{selectedReport.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Lokasi</p>
                <p className="text-gray-800">{selectedReport.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Koordinat: {parseFloat(selectedReport.latitude).toFixed(6)}, {parseFloat(selectedReport.longitude).toFixed(6)}
                </p>
              </div>

              {/* TPS Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-800">TPS Terdekat</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedReport.distance_to_tps <= 0.5 ? 'bg-red-100 text-red-700' :
                    selectedReport.distance_to_tps <= 3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedReport.distance_to_tps <= 0.5 ? 'DALAM RADIUS' :
                     selectedReport.distance_to_tps <= 3 ? 'EVALUASI MANUAL' :
                     'PERTIMBANGAN MANUAL'}
                  </span>
                </div>
                <p className="text-blue-900 font-medium">{selectedReport.nearest_tps}</p>
                <p className="text-blue-700 text-sm">
                  Jarak: {formatDistance(selectedReport.distance_to_tps)}
                </p>
                {selectedReport.distance_to_tps > 0.5 && (
                  <p className="text-amber-700 text-xs mt-2 font-medium">
                    Laporan di luar radius 500m - memerlukan evaluasi manual
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Deskripsi</p>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {selectedReport.admin_notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-1">📝 Catatan Admin Sebelumnya</p>
                  <p className="text-amber-900 text-sm">{selectedReport.admin_notes}</p>
                </div>
              )}

              {selectedReport.photo && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Foto Laporan</p>
                  <img
                    src={`/uploads/${selectedReport.photo}`}
                    alt="Foto laporan"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Update Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-gray-800 mb-4">Kelola Laporan</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign ke Petugas <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={updateData.assigned_to}
                      onChange={(e) => setUpdateData({...updateData, assigned_to: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Pilih Petugas --</option>
                      {petugasList.map((petugas) => (
                        <option key={petugas.id} value={petugas.id}>
                          {petugas.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Pilih petugas untuk menugaskan laporan ini
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Admin
                    </label>
                    <textarea
                      value={updateData.admin_notes}
                      onChange={(e) => setUpdateData({...updateData, admin_notes: e.target.value})}
                      placeholder="Tambahkan catatan untuk petugas..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdateReport}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    ✅ Tugaskan ke Petugas
                  </button>
                  <button
                    onClick={handleRejectReport}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    ❌ Tolak Laporan
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDLH;

