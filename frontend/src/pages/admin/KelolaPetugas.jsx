import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';

const KelolaPetugas = () => {
  const [petugas, setPetugas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    fetchPetugas();
  }, []);

  const fetchPetugas = async () => {
    try {
      const response = await usersAPI.getAllPetugas();
      setPetugas(response.data);
    } catch (error) {
      console.error('Error fetching petugas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (petugas = null) => {
    if (petugas) {
      setEditMode(true);
      setSelectedPetugas(petugas);
      setFormData({
        name: petugas.name,
        email: petugas.email,
        password: '',
        phone: petugas.phone,
        status: petugas.status
      });
    } else {
      setEditMode(false);
      setSelectedPetugas(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedPetugas(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await usersAPI.updatePetugas(selectedPetugas.id, updateData);
        alert('Petugas berhasil diupdate!');
      } else {
        await usersAPI.createPetugas(formData);
        alert('Petugas berhasil ditambahkan!');
      }
      handleCloseModal();
      fetchPetugas();
    } catch (error) {
      alert('Gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus petugas ini?')) return;
    
    try {
      await usersAPI.deletePetugas(id);
      alert('Petugas berhasil dihapus!');
      fetchPetugas();
    } catch (error) {
      alert('Gagal menghapus: ' + (error.response?.data?.message || error.message));
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Kelola Petugas</h1>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Tambah Petugas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {petugas.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${
                    p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {p.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {p.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Telepon:</span> {p.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Bergabung:</span>{' '}
                  {new Date(p.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(p)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {petugas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Belum ada petugas. Klik tombol "Tambah Petugas" untuk menambahkan.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editMode ? 'Edit Petugas' : 'Tambah Petugas Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editMode && '(Kosongkan jika tidak ingin mengubah)'}
                  </label>
                  <input
                    type="password"
                    required={!editMode}
                    className="input-field"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">
                    {editMode ? 'Update' : 'Tambah'}
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

export default KelolaPetugas;

