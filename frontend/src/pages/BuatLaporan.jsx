import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../services/api';

const BuatLaporan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_phone: '',
    reporter_email: '',
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    category: 'sampah_rumah_tangga',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          alert('Lokasi berhasil didapatkan!');
        },
        (error) => {
          alert('Gagal mendapatkan lokasi: ' + error.message);
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolocation');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await reportsAPI.create(data);
      alert('Laporan berhasil dibuat! Terima kasih atas partisipasi Anda.');
      navigate('/laporan');
    } catch (error) {
      alert('Gagal membuat laporan: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Buat Laporan Baru</h1>
          <p className="text-gray-600 mb-8">
            Laporkan sampah liar di sekitar Anda untuk lingkungan yang lebih bersih
          </p>

          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reporter_name"
                required
                className="input-field"
                value={formData.reporter_name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="reporter_phone"
                required
                className="input-field"
                value={formData.reporter_phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Opsional)
              </label>
              <input
                type="email"
                name="reporter_email"
                className="input-field"
                value={formData.reporter_email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Sampah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                className="input-field"
                value={formData.location}
                onChange={handleChange}
                placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Pusat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Koordinat GPS (Opsional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="latitude"
                  className="input-field"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Latitude"
                  readOnly
                />
                <input
                  type="text"
                  name="longitude"
                  className="input-field"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Longitude"
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="btn-secondary whitespace-nowrap"
                >
                  📍 Ambil Lokasi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Sampah <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="sampah_rumah_tangga">Sampah Rumah Tangga</option>
                <option value="sampah_industri">Sampah Industri</option>
                <option value="sampah_elektronik">Sampah Elektronik</option>
                <option value="sampah_bangunan">Sampah Bangunan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan kondisi sampah, perkiraan volume, dan informasi lain yang relevan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Sampah (Opsional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, JPEG, PNG. Maksimal 5MB
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim...' : '📤 Kirim Laporan'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-outline"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuatLaporan;

