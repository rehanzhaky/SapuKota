import { useState, useEffect } from 'react';
import { reportsAPI, usersAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const KelolaLaporan = () => {
  const [reports, setReports] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    assigned_to: '',
    admin_notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, petugasRes] = await Promise.all([
        reportsAPI.getAll({ limit: 100 }),
        usersAPI.getAllPetugas()
      ]);
      setReports(reportsRes.data.reports);
      setPetugas(petugasRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const getCategoryLabel = (category) => {
    const labels = {
      sampah_rumah_tangga: 'Sampah Rumah Tangga',
      sampah_industri: 'Sampah Industri',
      sampah_elektronik: 'Sampah Elektronik',
      sampah_bangunan: 'Sampah Bangunan',
      lainnya: 'Lainnya'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Kelola Laporan</h1>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Pelapor</th>
                <th className="text-left py-3 px-4">Lokasi</th>
                <th className="text-left py-3 px-4">Kategori</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Petugas</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{report.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{report.reporter_name}</p>
                      <p className="text-sm text-gray-500">{report.reporter_phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate">{report.location}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{getCategoryLabel(report.category)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={report.status} />
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
              ))}
            </tbody>
          </table>

          {reports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Tidak ada laporan
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Kelola Laporan #{selectedReport.id}</h2>

              {/* Report Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Pelapor</p>
                    <p className="font-medium">{selectedReport.reporter_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telepon</p>
                    <p className="font-medium">{selectedReport.reporter_phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Lokasi</p>
                    <p className="font-medium">{selectedReport.location}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Deskripsi</p>
                    <p className="font-medium">{selectedReport.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Kategori</p>
                    <p className="font-medium">{getCategoryLabel(selectedReport.category)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal Laporan</p>
                    <p className="font-medium">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                </div>
                {selectedReport.photo && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2">Foto</p>
                    <img
                      src={`/uploads/${selectedReport.photo}`}
                      alt="Laporan"
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Update Form */}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="pending">Menunggu</option>
                    <option value="approved">Disetujui</option>
                    <option value="assigned">Ditugaskan</option>
                    <option value="in_progress">Dalam Proses</option>
                    <option value="completed">Selesai</option>
                    <option value="rejected">Ditolak</option>
                  </select>
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
                    <option value="">Pilih Petugas</option>
                    {petugas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Admin
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.admin_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                    placeholder="Tambahkan catatan jika diperlukan"
                  />
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-outline"
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

