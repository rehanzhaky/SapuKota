import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import CountUp from '../components/CountUp';
import heroImage from '../assets/Img.png';

const Home = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    latitude: null,
    longitude: null,
    description: '',
    photo: null
  });
  const [stats, setStats] = useState({
    total: 50,
    identified: 548,
    collected: 554,
    volunteers: 82
  });

  useEffect(() => {
    fetchRecentReports();
    fetchStats();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const response = await reportsAPI.getRecent();
      setRecentReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reportsAPI.getAll();
      const reports = response.data.reports || [];
      setStats({
        total: reports.length,
        identified: reports.filter(r => ['approved', 'assigned', 'in_progress', 'completed'].includes(r.status)).length,
        collected: reports.filter(r => r.status === 'completed').length,
        volunteers: 82 // Static for now
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLoadingLocation(false);
    setFormData({
      title: '',
      location: '',
      latitude: null,
      longitude: null,
      description: '',
      photo: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Gagal mendapatkan lokasi. Pastikan Anda telah memberikan izin akses lokasi.');
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.location || !formData.description || !formData.photo) {
      alert('Harap lengkapi semua field yang wajib diisi!');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      alert('Harap ambil lokasi Anda terlebih dahulu!');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('photo', formData.photo);

      const response = await reportsAPI.create(formDataToSend);
      
      if (response.data) {
        alert('Laporan berhasil dikirim!');
        handleCloseModal();
        fetchRecentReports(); // Refresh reports
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white pt-20">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w">
            {/* Heading */}
            <h1 className="font-medium mb-6" style={{ fontSize: '100px', lineHeight: '85%', letterSpacing: '-6%' }}>
              <span className="text-gray-900">Bantu </span>
              <span className="text-primary-600">Laporkan</span>
              <br />
              <span className="text-secondary-500">Sampah</span>
              <span className="text-gray-900"> Liar</span>
            </h1>

            {/* Description */}
            <p className="text-gray-700 font-medium mb-8 max-w" style={{ fontSize: '24px', lineHeight: '100%', letterSpacing: '-3%' }}>
              Bantu menjaga kebersihan dengan melaporkan sampah liar di sekitar Anda.
              <br />
              Setiap laporan akan segera ditindaklanjuti untuk pembersihan dan pemeliharaan lingkungan
            </p>

            {/* CTA Button */}
            <button
              onClick={handleOpenModal}
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-10 py-3.5 rounded-full transition-colors text-lg shadow-lg"
            >
              Laporkan
            </button>

            {/* Hero Image */}
            <div className="mt-12 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Hero Image"
                className="w-full h-[234px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-[30px] pb-16 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-wrap justify-between gap-y-8 lg:gap-y-0">
            <div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.total} duration={2000} />
              </h3>
              <p className="text-gray-600 text-base lg:text-lg">Laporan Masuk</p>
            </div>
            <div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.identified} duration={2000} />
              </h3>
              <p className="text-gray-600 text-base lg:text-lg">Laporan Teridentifikasi</p>
            </div>
            <div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.collected} duration={2000} />
              </h3>
              <p className="text-gray-600 text-base lg:text-lg">Sampah Diangkut</p>
            </div>
            <div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.volunteers} duration={2000} />
              </h3>
              <p className="text-gray-600 text-base lg:text-lg">Relawan Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Laporan Terbaru
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {recentReports.map((report) => (
                <div key={report.id} className="card hover:shadow-lg transition-shadow">
                  {report.photo && (
                    <img 
                      src={`/uploads/${report.photo}`} 
                      alt="Laporan" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-3">
                    <StatusBadge status={report.status} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{report.location}</p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                  <div className="flex justify-end items-center text-xs text-gray-500">
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/laporan" className="btn-outline">
              Lihat Semua Laporan
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="card cursor-pointer">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                Bagaimana cara melaporkan sampah liar?
              </summary>
              <p className="mt-3 text-gray-600">
                Klik tombol "Buat Laporan" di halaman utama, isi formulir dengan lengkap termasuk lokasi dan foto sampah, lalu kirim. Anda tidak perlu login untuk membuat laporan.
              </p>
            </details>

            <details className="card cursor-pointer">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                Berapa lama waktu yang dibutuhkan untuk menindaklanjuti laporan?
              </summary>
              <p className="mt-3 text-gray-600">
                Tim kami akan meninjau laporan dalam 1x24 jam. Setelah disetujui, petugas akan ditugaskan untuk melakukan pengangkutan sampah sesuai prioritas dan lokasi.
              </p>
            </details>

            <details className="card cursor-pointer">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                Apakah saya bisa melacak status laporan saya?
              </summary>
              <p className="mt-3 text-gray-600">
                Ya, Anda dapat melihat status laporan di halaman "Laporan". Status akan diperbarui secara real-time mulai dari pending, disetujui, ditugaskan, dalam proses, hingga selesai.
              </p>
            </details>

            <details className="card cursor-pointer">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                Jenis sampah apa saja yang bisa dilaporkan?
              </summary>
              <p className="mt-3 text-gray-600">
                Anda dapat melaporkan berbagai jenis sampah liar seperti sampah rumah tangga, sampah industri, sampah elektronik, sampah bangunan, dan lainnya yang mencemari lingkungan.
              </p>
            </details>

            <details className="card cursor-pointer">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                Apakah ada biaya untuk melaporkan sampah?
              </summary>
              <p className="mt-3 text-gray-600">
                Tidak ada biaya sama sekali. Layanan pelaporan dan pengangkutan sampah liar ini sepenuhnya gratis untuk masyarakat.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundColor: 'rgba(209, 209, 209, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-3xl font-bold text-primary-600 mb-8">Buat Laporan</h2>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Judul Laporan */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Judul Laporan</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul laporan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Lokasi</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Klik tombol untuk ambil lokasi"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    readOnly
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loadingLocation ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>📍 Ambil Lokasi</>
                    )}
                  </button>
                </div>
                {formData.latitude && formData.longitude && (
                  <p className="mt-1 text-xs text-gray-500">
                    Koordinat: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Deskripsi Laporan */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Deskripsi Laporan</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan kondisi sampah liar yang anda temukan"
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Upload Foto</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-700 text-lg">
                      Drag & Drop file anda atau <span className="text-primary-600 font-semibold">pilih..</span>
                    </p>
                    {formData.photo && (
                      <p className="mt-2 text-sm text-gray-600">File: {formData.photo.name}</p>
                    )}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-full transition-colors text-lg shadow-lg mt-8"
              >
                Kirim Laporan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

