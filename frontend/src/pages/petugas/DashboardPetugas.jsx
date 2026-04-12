import { useState, useEffect } from 'react';
import { usersAPI, reportsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PetugasNavigationMap from '../../components/PetugasNavigationMap';
import { getUploadUrl } from '../../utils/imageHelper';

const DashboardPetugas = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [navigationTask, setNavigationTask] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [accepting, setAccepting] = useState(false);
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
      setTasks(response.data.data || response.data || []);
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

  const handleOpenNavigationModal = (task) => {
    setNavigationTask(task);
    setShowNavigationModal(true);
  };

  const handleCloseNavigationModal = () => {
    setShowNavigationModal(false);
    setNavigationTask(null);
  };

  const handleAcceptTask = async (taskId) => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung GPS location');
      return;
    }

    const confirmed = window.confirm('📍 Anda akan menerima tugas ini. Posisi GPS Anda akan direkam. Lanjutkan?');
    if (!confirmed) return;

    setAccepting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await reportsAPI.acceptTask(taskId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          alert('✅ Tugas berhasil diterima! Status diubah ke "In Progress". Posisi Anda telah terekam.');
          fetchTasks();
        } catch (error) {
          alert('Gagal menerima tugas: ' + (error.response?.data?.message || error.message));
        } finally {
          setAccepting(false);
        }
      },
      (error) => {
        setAccepting(false);
        alert('Gagal mendapatkan lokasi GPS: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleCheckIn = async (taskId) => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung GPS location');
      return;
    }

    setCheckingIn(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await reportsAPI.checkIn(taskId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          alert('✅ Check-in berhasil! Anda sudah berada di lokasi.');
          fetchTasks();
        } catch (error) {
          alert('Gagal check-in: ' + (error.response?.data?.message || error.message));
        } finally {
          setCheckingIn(false);
        }
      },
      (error) => {
        setCheckingIn(false);
        alert('Gagal mendapatkan lokasi GPS: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // If completing task, get GPS first
    if (formData.status === 'completed') {
      if (!navigator.geolocation) {
        alert('Browser Anda tidak mendukung GPS location');
        return;
      }

      const confirmed = window.confirm('📍 Menyelesaikan tugas akan merekam posisi GPS Anda. Lanjutkan?');
      if (!confirmed) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await submitUpdate(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert('Gagal mendapatkan lokasi GPS: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      await submitUpdate();
    }
  };

  const submitUpdate = async (latitude = null, longitude = null) => {
    try {
      const data = new FormData();
      data.append('status', formData.status);
      if (formData.completion_notes) {
        data.append('completion_notes', formData.completion_notes);
      }
      if (formData.completion_photo) {
        data.append('completion_photo', formData.completion_photo);
      }
      if (latitude && longitude) {
        data.append('latitude', latitude);
        data.append('longitude', longitude);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Petugas</h1>
        <p className="text-gray-600 mb-8">Kelola tugas pengangkutan sampah Anda</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium mb-2">Total Tugas</p>
            <p className="text-4xl font-bold text-gray-900">{tasks.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium mb-2">Tugas Aktif</p>
            <p className="text-4xl font-bold text-gray-900">{activeTasks.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <p className="text-gray-500 text-sm font-medium mb-2">Selesai</p>
            <p className="text-4xl font-bold text-gray-900">{completedTasks.length}</p>
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
                      src={getUploadUrl(task.photo)}
                      alt="Laporan" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <StatusBadge status={task.status} context="petugas" />
                    <div className="flex gap-2">
                      {task.accepted_at && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium flex items-center gap-1">
                          ✓ Diterima
                        </span>
                      )}
                      {task.arrived_at && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                          ✓ Di lokasi
                        </span>
                      )}
                    </div>
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
                    {task.accepted_at && (
                      <p className="text-gray-600">
                        <span className="font-medium">Diterima:</span> {formatDate(task.accepted_at)}
                      </p>
                    )}
                    {task.arrived_at && (
                      <p className="text-gray-600">
                        <span className="font-medium">Sampai di lokasi:</span> {formatDate(task.arrived_at)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {/* Tombol Navigasi - untuk semua tugas dengan GPS */}
                    {task.latitude && task.longitude && (
                      <button
                        onClick={() => handleOpenNavigationModal(task)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        🗺️ Navigasi ke Lokasi
                      </button>
                    )}
                    {/* Tombol Terima Tugas - hanya untuk status assigned */}
                    {task.status === 'assigned' && !task.accepted_at && (
                      <button
                        onClick={() => handleAcceptTask(task.id)}
                        disabled={accepting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {accepting ? (
                          <>⏳ Merekam GPS...</>
                        ) : (
                          <>✋ Terima Tugas (GPS)</>
                        )}
                      </button>
                    )}
                    {/* Tombol Check-in - untuk in_progress yang belum sampai */}
                    {task.status === 'in_progress' && !task.arrived_at && (
                      <button
                        onClick={() => handleCheckIn(task.id)}
                        disabled={checkingIn}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkingIn ? '📍 Mengambil GPS...' : '📍 Saya Sudah Sampai'}
                      </button>
                    )}
                    {/* Tombol Update Status - untuk yang sudah in_progress */}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => handleOpenModal(task)}
                        className="w-full btn-primary"
                      >
                        Update Status
                      </button>
                    )}
                  </div>
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
                    <StatusBadge status={task.status} context="petugas" />
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

      {/* Navigation Modal */}
      {showNavigationModal && navigationTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Navigasi ke Lokasi</h2>
              <button
                onClick={handleCloseNavigationModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <PetugasNavigationMap report={navigationTask} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPetugas;

