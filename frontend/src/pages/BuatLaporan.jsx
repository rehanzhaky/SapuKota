import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../services/api';

const BuatLaporan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    latitude: null,
    longitude: null,
    description: '',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        e.target.value = '';
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format file harus JPG, JPEG, atau PNG');
        e.target.value = '';
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      setError('');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser Anda tidak mendukung geolocation');
      return;
    }

    setLoadingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        // Save coordinates
        setFormData(prev => ({
          ...prev,
          location: locationText,
          latitude: latitude,
          longitude: longitude
        }));
        setLoadingLocation(false);
        
        // Optional: Try to get address from coordinates using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) {
              setFormData(prev => ({
                ...prev,
                location: data.display_name,
                latitude: latitude,
                longitude: longitude
              }));
            }
          })
          .catch(err => {
            console.log('Reverse geocoding failed, using coordinates');
          });
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Gagal mendapatkan lokasi. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Anda menolak akses lokasi. Silakan izinkan akses lokasi di browser Anda.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Informasi lokasi tidak tersedia.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Request timeout. Silakan coba lagi.';
            break;
          default:
            errorMessage += 'Terjadi kesalahan yang tidak diketahui.';
        }
        
        setError(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      const response = await reportsAPI.create(data);
      alert('✅ Laporan berhasil dibuat! Terima kasih atas partisipasi Anda.');
      navigate('/laporan');
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Gagal mengirim laporan';
      setError(errorMessage);
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
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="inline-flex text-red-400 hover:text-red-600"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Laporan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Sampah Menumpuk di Jalan Sudirman"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi <span className="text-red-500">*</span>
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
                Deskripsi Laporan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="5"
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan kondisi sampah, perkiraan volume, dan informasi lain yang relevan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Foto <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                  required
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Klik untuk upload atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, JPEG, PNG (Max. 5MB)
                    </p>
                  </div>
                  {formData.photo && (
                    <p className="mt-3 text-sm font-medium text-primary-600">
                      ✓ {formData.photo.name}
                    </p>
                  )}
                </label>
              </div>
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

