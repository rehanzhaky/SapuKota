import { useState, useEffect } from 'react';
import { usersAPI, reportsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const DashboardPetugas = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    completion_notes: '',
    completion_photo: null
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await usersAPI.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setFormData({
      status: task.status,
      completion_notes: task.completion_notes || '',
      completion_photo: null
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('status', formData.status);
      if (formData.completion_notes) {
        data.append('completion_notes', formData.completion_notes);
      }
      if (formData.completion_photo) {
        data.append('completion_photo', formData.completion_photo);
      }

      await reportsAPI.updateProgress(selectedTask.id, data);
      alert('Status tugas berhasil diupdate!');
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      alert('Gagal update: ' + (error.response?.data?.message || error.message));
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

  const activeTasks = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status));
  const completedTasks = tasks.filter(t => t.status === 'completed');

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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Petugas</h1>
        <p className="text-gray-600 mb-8">Kelola tugas pengangkutan sampah Anda</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Tugas</p>
                <p className="text-3xl font-bold">{tasks.length}</p>
              </div>
              <div className="text-5xl opacity-50">📋</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Tugas Aktif</p>
                <p className="text-3xl font-bold">{activeTasks.length}</p>
              </div>
              <div className="text-5xl opacity-50">🚛</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Selesai</p>
                <p className="text-3xl font-bold">{completedTasks.length}</p>
              </div>
              <div className="text-5xl opacity-50">✅</div>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tugas Aktif</h2>
          {activeTasks.length === 0 ? (
            <div className="card text-center text-gray-500">
              Tidak ada tugas aktif saat ini
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTasks.map((task) => (
                <div key={task.id} className="card border-l-4 border-orange-500">
                  {task.photo && (
                    <img 
                      src={`/uploads/${task.photo}`} 
                      alt="Laporan" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-3">
                    <StatusBadge status={task.status} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{task.location}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  <div className="space-y-1 text-sm mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Kategori:</span> {getCategoryLabel(task.category)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Pelapor:</span> {task.reporter_name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Telepon:</span> {task.reporter_phone}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="w-full btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tugas Selesai</h2>
          {completedTasks.length === 0 ? (
            <div className="card text-center text-gray-500">
              Belum ada tugas yang diselesaikan
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTasks.map((task) => (
                <div key={task.id} className="card border-l-4 border-green-500 opacity-75">
                  <div className="mb-3">
                    <StatusBadge status={task.status} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{task.location}</h3>
                  <p className="text-sm text-gray-600 mb-3">{getCategoryLabel(task.category)}</p>
                  <p className="text-xs text-gray-500">
                    Selesai: {task.completed_at ? formatDate(task.completed_at) : '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Update Status Tugas</h2>

              {/* Task Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{selectedTask.location}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedTask.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Kategori:</span>
                    <span className="ml-2 font-medium">{getCategoryLabel(selectedTask.category)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pelapor:</span>
                    <span className="ml-2 font-medium">{selectedTask.reporter_name}</span>
                  </div>
                </div>
                {selectedTask.photo && (
                  <img
                    src={`/uploads/${selectedTask.photo}`}
                    alt="Laporan"
                    className="w-full h-48 object-cover rounded-lg mt-3"
                  />
                )}
              </div>

              {/* Update Form */}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Tugas
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="assigned">Ditugaskan</option>
                    <option value="in_progress">Sedang Dikerjakan</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Penyelesaian
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.completion_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, completion_notes: e.target.value }))}
                    placeholder="Tambahkan catatan tentang penyelesaian tugas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Bukti Penyelesaian
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => setFormData(prev => ({ ...prev, completion_photo: e.target.files[0] }))}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload foto setelah sampah diangkut (opsional)
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">
                    Simpan Update
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

export default DashboardPetugas;

