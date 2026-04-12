import { useState, useEffect } from 'react';
import { reportsAPI, usersAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { findNearestTPS, formatDistance, getPriority } from '../../utils/distance';
import { getUploadUrl } from '../../utils/imageHelper';

const KelolaLaporan = () => {
  const [reports, setReports] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    status: '',
    assigned_to: '',
    admin_notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [filterStatus, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchQuery) params.search = searchQuery;
      params.limit = 100;

      const [reportsRes, petugasRes] = await Promise.all([
        reportsAPI.getAll(params),
        usersAPI.getAllPetugas()
      ]);
      setReports(reportsRes.data.reports || []);
      setPetugas(petugasRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setFormData({
      status: report.status,
      assigned_to: report.assigned_to || '',
      admin_notes: report.admin_notes || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await reportsAPI.updateStatus(selectedReport.id, formData);
      alert('Laporan berhasil diupdate!');
      handleCloseModal();
      fetchData();
    } catch (error) {
      alert('Gagal update laporan: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    // Admin view: simplified status labels
    if (status === 'rejected') {
      return 'Ditolak';
    }
    // All other statuses show as Diproses for admin
    return 'Diproses';
  };

  const getReportPriorityData = (report) => {
    if (!report.latitude || !report.longitude) {
      return {
        nearestTPS: null,
        distance: null,
        priority: null
      };
    }

    const nearestTPS = findNearestTPS(report.latitude, report.longitude);
    if (!nearestTPS) {
      return {
        nearestTPS: null,
        distance: null,
        priority: null
      };
    }

    const priority = getPriority(nearestTPS.distance);
    
    return {
      nearestTPS,
      distance: nearestTPS.distance,
      priority
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Kelola Laporan</h1>
        <div className="text-lg font-semibold text-gray-600">
          Total: {reports.length} laporan
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Laporan
            </label>
            <input
              type="text"
              placeholder="Cari judul, lokasi, atau deskripsi..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Status
            </label>
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="pending,approved,assigned,in_progress,completed">Diproses</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-x-auto border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Judul</th>
                <th className="text-left py-3 px-4">Lokasi</th>
                <th className="text-left py-3 px-4">Jarak TPS</th>
                <th className="text-left py-3 px-4">Prioritas</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Petugas</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const priorityData = getReportPriorityData(report);
                return (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{report.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{report.title}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="truncate">{report.location}</p>
                    </td>
                    <td className="py-3 px-4">
                      {priorityData.nearestTPS ? (
                        <div className="text-sm">
                          <p className="font-medium">{formatDistance(priorityData.distance)}</p>
                          <p className="text-xs text-gray-500">{priorityData.nearestTPS.name}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {priorityData.priority ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityData.priority.level === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : priorityData.priority.level === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {priorityData.priority.label}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={report.status} context="admin" />
                    </td>
                    <td className="py-3 px-4">
                      {report.assignedPetugas ? (
                        <span className="text-sm">{report.assignedPetugas.name}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Belum ditugaskan</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenModal(report)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {reports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Tidak ada laporan
            </div>
          )}
        </div>

      {/* Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Kelola Laporan #{selectedReport.id}</h2>

              {/* Report Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Judul Laporan</p>
                    <p className="font-medium text-lg">{selectedReport.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lokasi</p>
                    <p className="font-medium">{selectedReport.location}</p>
                    {selectedReport.latitude && selectedReport.longitude && (
                      <p className="text-xs text-gray-500 mt-1">
                        Koordinat: {selectedReport.latitude}, {selectedReport.longitude}
                      </p>
                    )}
                  </div>
                  
                  {/* TPS Terdekat & Prioritas */}
                  {(() => {
                    const priorityData = getReportPriorityData(selectedReport);
                    if (priorityData.nearestTPS) {
                      return (
                        <>
                          <div className="col-span-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-gray-600 font-medium mb-2">TPS Terdekat</p>
                            <p className="font-medium text-blue-900">{priorityData.nearestTPS.name}</p>
                            <p className="text-sm text-blue-700 mt-1">
                              Jarak: <strong>{formatDistance(priorityData.distance)}</strong>
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Truk: {priorityData.nearestTPS.truck}
                            </p>
                          </div>
                          <div className="col-span-1">
                            <p className="text-gray-600">Prioritas Pengangkutan</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                priorityData.priority.level === 'high' 
                                  ? 'bg-red-100 text-red-700' 
                                  : priorityData.priority.level === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {priorityData.priority.label}
                              </span>
                              <span className="text-sm text-gray-600">
                                - {priorityData.priority.description}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    }
                    return null;
                  })()}

                  <div>
                    <p className="text-gray-600">Deskripsi</p>
                    <p className="font-medium">{selectedReport.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status Saat Ini</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedReport.status} context="admin" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal Laporan</p>
                    <p className="font-medium">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                </div>
                {selectedReport.photo && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2">Foto Laporan</p>
                    <img
                      src={getUploadUrl(selectedReport.photo)}
                      alt="Laporan"
                      className="w-full max-h-96 object-contain rounded-lg border"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFoto tidak tersedia%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Update Form */}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubah Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="approved">Approve (Setujui Laporan)</option>
                    <option value="assigned">Assign (Tugaskan ke Petugas)</option>
                    <option value="rejected">Reject (Tolak Laporan)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Status saat ini: <strong>{getStatusLabel(selectedReport.status)}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tugaskan ke Petugas
                  </label>
                  <select
                    className="input-field"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  >
                    <option value="">Belum ditugaskan</option>
                    {petugas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </select>
                  {petugas.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Belum ada data petugas. Silakan tambahkan petugas terlebih dahulu di menu Kelola Petugas.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Admin
                  </label>
                  <textarea
                    className="input-field"
                    rows="4"
                    value={formData.admin_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                    placeholder="Tambahkan catatan untuk laporan ini (opsional)"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">
                    💾 Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-outline px-6"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaLaporan;

