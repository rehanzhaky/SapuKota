import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI, usersAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import CountUp from '../components/CountUp';
import heroImage from '../assets/Img.png';
import bawahJembatanImage from '../assets/bawahjembatan.jpeg';
import pinggirJalanImage from '../assets/pinggirjalan.jpeg';
import tpsResmiImage from '../assets/tpsresmi.jpeg';
import tpsLiarImage from '../assets/tpsliar.jpeg';
import { getUploadUrl } from '../utils/imageHelper';

// Static data untuk tampilan sementara
const staticReports = [
  {
    id: 1,
    title: 'Rubah Anonim',
    location: 'Rawasari Tanjungpinang',
    description: 'menemukan sampah plastik yang mengotori pesisir Rawasari',
    createdAt: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: 2,
    title: 'Kelinci Lompat',
    location: 'Kawal Bintan',
    description: 'ada tumpukan sampah yang berserakan dimana mana di saya harap ini bisa cepat ditangani',
    createdAt: new Date().toISOString(),
    status: 'approved'
  },
  {
    id: 3,
    title: 'Trenggiling Terbang',
    location: 'Kijang Lama Tanjung Pinang',
    description: 'Banyak sekali sampah yang berceceran disekitar pantai kijang lama',
    createdAt: new Date().toISOString(),
    status: 'in_progress'
  },
  {
    id: 4,
    title: 'Kucing Berlari',
    location: 'Tanjung Uban',
    description: 'Sampah plastik dan botol-botol bekas menumpuk di pinggir jalan',
    createdAt: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: 5,
    title: 'Gajah Menari',
    location: 'Senggarang Tanjungpinang',
    description: 'Ditemukan tumpukan sampah organik yang sudah membusuk',
    createdAt: new Date().toISOString(),
    status: 'completed'
  }
];

const Home = () => {
  const [recentReports, setRecentReports] = useState(staticReports);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    petugas: 0
  });

  useEffect(() => {
    // Fetch data dari backend
    fetchRecentReports();
    fetchStats();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getRecent();
      setRecentReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Fallback ke static data jika error
      setRecentReports(staticReports);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [reportsResponse, petugasResponse] = await Promise.all([
        reportsAPI.getAll(),
        usersAPI.getPetugasCount()
      ]);
      
      const reports = reportsResponse.data.reports || [];
      const petugasCount = petugasResponse.data.count || 0;
      
      setStats({
        total: reports.length,
        identified: reports.filter(r => ['approved', 'assigned', 'in_progress', 'completed'].includes(r.status)).length,
        collected: reports.filter(r => r.status === 'completed').length,
        petugas: petugasCount
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
      alert('Browser Anda tidak mendukung geolocation');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        setFormData(prev => ({
          ...prev,
          location: locationText,
          latitude: latitude,
          longitude: longitude
        }));
        setLoadingLocation(false);
        
        // Optional: Try to get address from coordinates
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
        
        alert(errorMessage);
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

    // Validation
    if (!formData.title || !formData.location || !formData.description || !formData.photo) {
      alert('Harap lengkapi semua field yang wajib diisi!');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('photo', formData.photo);
      
      // Include latitude and longitude if available
      if (formData.latitude !== null) {
        formDataToSend.append('latitude', formData.latitude);
      }
      if (formData.longitude !== null) {
        formDataToSend.append('longitude', formData.longitude);
      }

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
      <section className="bg-white pt-16 sm:pt-20 pb-8 sm:pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="max-w">
            {/* Heading */}
            <h1 className="font-medium mb-4 sm:mb-6" style={{ fontSize: 'clamp(48px, 10vw, 100px)', lineHeight: '85%', letterSpacing: '-6%' }}>
              <span className="text-gray-900">Bantu </span>
              <span className="text-primary-600">Laporkan</span>
              <br />
              <span className="text-secondary-500">Sampah</span>
              <span className="text-gray-900"> Liar</span>
            </h1>

            {/* Description */}
            <p className="text-gray-700 font-medium mb-6 sm:mb-8 max-w" style={{ fontSize: 'clamp(16px, 2.5vw, 24px)', lineHeight: '120%', letterSpacing: '-3%' }}>
              Lingkungan bersih dimulai dari langkah kecil.
              <br />
              Laporkan sampah liar yang kamu temui, dan jadi bagian dari perubahan.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleOpenModal}
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 sm:px-10 py-3 sm:py-3.5 rounded-full transition-colors text-base sm:text-lg shadow-lg"
            >
              Laporkan
            </button>

            {/* Hero Image */}
            <div className="mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Hero Image"
                className="w-full h-[180px] sm:h-[234px] md:h-[280px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-6 sm:pt-8 pb-12 sm:pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.total} duration={2000} />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Laporan Masuk</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.identified} duration={2000} />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Laporan Teridentifikasi</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.collected} duration={2000} />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Sampah Diangkut</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                <CountUp end={stats.petugas} duration={2000} />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Petugas Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Left Side - Title & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="lg:pt-[3px]">
              <h3 className="text-secondary-500 font-medium mb-3 sm:mb-[10px] text-lg sm:text-xl md:text-2xl" style={{ lineHeight: '100%', letterSpacing: '0%' }}>
                -Laporan Terbaru
              </h3>
              <h2 className="text-gray-900 font-semibold mb-6 sm:mb-8 md:mb-[40px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ lineHeight: '100%', letterSpacing: '0%' }}>
                Laporan Terbaru Tentang Sampah Liar
              </h2>
              <p className="text-gray-700 font-medium text-base sm:text-lg md:text-xl lg:text-2xl" style={{ lineHeight: '100%', letterSpacing: '0%' }}>
                Temukan laporan terbaru terkait sampah liar yang terdeteksi di berbagai lokasi. Laporan ini mencakup detail temuan serta langkah-langkah yang telah diambil
              </p>
            </div>

            {/* Right Side - Scrolling Reports */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500 mx-auto"></div>
                </div>
              ) : (
                <div className="animate-scroll-up space-y-4 will-change-transform">
                  {/* Duplicate reports for infinite scroll effect */}
                  {[...recentReports, ...recentReports, ...recentReports, ...recentReports].map((report, index) => (
                    <div key={`${report.id}-${index}`} className="bg-white rounded-2xl p-6">
                      <div className="flex items-start gap-6">
                        {/* Avatar/Photo */}
                        <div className="flex-shrink-0">
                          {report.photo ? (
                            <img 
                              src={getUploadUrl(report.photo)}
                              alt="Reporter" 
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-xl sm:text-2xl">
                              {report.title?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        
                        {/* Report Content */}
                        <div className="flex-1">
                          {/* Name and Location - Same Line */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                            <h3 className="font-semibold text-gray-900 text-lg sm:text-xl lg:text-2xl">{report.title}</h3>
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{report.location}</span>
                            </div>
                          </div>
                          {/* Comment/Description */}
                          <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Fade gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Edukasi Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Edukasi Lingkungan
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Mari bersama-sama memahami pentingnya pengelolaan sampah yang baik
            </p>
          </div>

          {/* Apa Itu TPS Liar */}
          <div className="mb-12 sm:mb-16 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 sm:px-8 py-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Apa Itu TPS Liar?
              </h3>
            </div>
            
            <div className="p-6 sm:p-8">
              {/* Images Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl overflow-hidden shadow-md bg-red-100 h-40 sm:h-48 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Sampah Berserakan</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-md bg-red-100 h-40 sm:h-48 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">TPS Liar Ilegal</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-md bg-red-100 h-40 sm:h-48 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Pencemaran Lingkungan</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-red-50 rounded-xl p-4 sm:p-6 border-l-4 border-red-500">
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                  TPS liar adalah <span className="font-semibold">tempat pembuangan sampah yang tidak resmi</span> dan <span className="font-semibold">tidak memiliki izin</span>. 
                  Biasanya, sampah di tempat-tempat seperti ini berada di pinggir jalan, lahan kosong, atau area umum, dan kita mengeluhkan pencemaran 
                  lingkungan serta masalah kesehatan.
                </p>
              </div>
            </div>
          </div>

          {/* TPS Resmi VS TPS Liar */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-10">
              TPS Resmi VS TPS Liar
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* TPS Resmi Card */}
              <div className="bg-white border-2 border-green-300 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-8">
                  <div className="rounded-2xl overflow-hidden h-40 sm:h-48 mb-4">
                    <img 
                      src={tpsResmiImage} 
                      alt="TPS Resmi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-center text-green-700">
                    TPS Resmi
                  </h4>
                </div>
                <div className="p-6 sm:p-8">
                  <ul className="space-y-3 sm:space-y-4">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg">Ada Izin</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg">Tertata</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg">Diangkut secara rutin</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* TPS Liar Card */}
              <div className="bg-white border-2 border-red-300 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 sm:p-8">
                  <div className="rounded-2xl overflow-hidden h-40 sm:h-48 mb-4">
                    <img 
                      src={tpsLiarImage} 
                      alt="TPS Liar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-center text-red-700">
                    TPS Liar
                  </h4>
                </div>
                <div className="p-6 sm:p-8">
                  <ul className="space-y-3 sm:space-y-4">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg">Tidak resmi</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg">Sembarangan</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base lg:text-lg">Menimbulkan masalah</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jenis-jenis TPS Liar Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Jenis-jenis TPS Liar
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Kenali lokasi-lokasi yang sering menjadi tempat pembuangan sampah ilegal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Di bawah jembatan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 sm:h-56 overflow-hidden">
                <img 
                  src={bawahJembatanImage} 
                  alt="TPS Liar di bawah jembatan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
                  Di bawah jembatan
                </h3>
                <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                  Sampah sering menumpuk di kolong jembatan karena area tersebut jarang dipantau dan sulit dijangkau
                </p>
              </div>
            </div>

            {/* Di pinggir jalan & selokan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 sm:h-56 overflow-hidden">
                <img 
                  src={pinggirJalanImage} 
                  alt="TPS Liar di pinggir jalan dan selokan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
                  Di pinggir jalan<br />& selokan
                </h3>
                <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                  Pinggir jalan dan selokan menjadi sasaran pembuangan sampah yang mengganggu kenyamanan dan kebersihan
                </p>
              </div>
            </div>

            {/* Di lahan kosong */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
              <div className="h-48 sm:h-56 overflow-hidden">
                <img 
                  src={pinggirJalanImage} 
                  alt="TPS Liar di lahan kosong" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
                  Di lahan kosong
                </h3>
                <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                  Lahan kosong sering disalahgunakan sebagai tempat pembuangan sampah karena tidak ada pengawasan
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-10 sm:mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-xl p-6 sm:p-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Penting untuk Diketahui!
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Jika Anda menemukan salah satu jenis TPS liar di atas, segera laporkan melalui aplikasi kami. 
                  Dengan melaporkan, Anda membantu pemerintah dalam menangani masalah sampah di lingkungan sekitar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peran Masyarakat Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Peran Masyarakat
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 mb-8 sm:mb-10">
              Bersama Kita Sapu Kota Batam dari Sampah
            </p>
          </div>

          {/* Action Cards */}
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            {/* Jadi pelapor aktif */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-primary-400 transition-all group">
              <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between cursor-pointer">
                <div className="flex items-center flex-1">
                  <div className="bg-primary-100 group-hover:bg-primary-200 rounded-full p-3 sm:p-4 mr-4 sm:mr-6 transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Jadi pelapor aktif
                  </h3>
                </div>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Ikut aksi bersih */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-primary-400 transition-all group">
              <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between cursor-pointer">
                <div className="flex items-center flex-1">
                  <div className="bg-secondary-100 group-hover:bg-secondary-200 rounded-full p-3 sm:p-4 mr-4 sm:mr-6 transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Ikut aksi bersih
                  </h3>
                </div>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Edukasi sekitar */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-primary-400 transition-all group">
              <div className="px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between cursor-pointer">
                <div className="flex items-center flex-1">
                  <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-3 sm:p-4 mr-4 sm:mr-6 transition-colors">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Edukasi sekitar
                  </h3>
                </div>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 italic">
              "Perubahan besar dimulai dari langkah kecil kita"
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Temukan jawaban untuk pertanyaan umum tentang pelaporan sampah liar
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <details className="group bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                  Bagaimana cara melaporkan sampah liar?
                </span>
                <span className="text-green-600 text-2xl font-light transition-transform group-open:rotate-45 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Klik tombol "Buat Laporan" di halaman utama, isi formulir dengan lengkap termasuk lokasi dan foto sampah, lalu kirim. Anda tidak perlu login untuk membuat laporan.
                </p>
              </div>
            </details>

            <details className="group bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                  Apakah ada sanksi bagi pelaku pembuangan sampah liar?
                </span>
                <span className="text-green-600 text-2xl font-light transition-transform group-open:rotate-45 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Ya, sesuai dengan peraturan daerah, pelaku pembuangan sampah liar dapat dikenakan sanksi berupa denda administratif. Besaran denda bervariasi tergantung pada jenis dan volume sampah yang dibuang.
                </p>
              </div>
            </details>

            <details className="group bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                  Apakah saya perlu mendaftar untuk membuat laporan
                </span>
                <span className="text-green-600 text-2xl font-light transition-transform group-open:rotate-45 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tidak, Anda tidak perlu mendaftar atau login. Cukup klik tombol "Buat Laporan" dan isi formulir yang tersedia dengan informasi yang diperlukan.
                </p>
              </div>
            </details>

            <details className="group bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                  Bagaimana saya bisa berkontribusi lebih jauh
                </span>
                <span className="text-green-600 text-2xl font-light transition-transform group-open:rotate-45 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Selain melaporkan sampah liar, Anda dapat berkontribusi dengan menjaga kebersihan lingkungan, memilah sampah dengan benar, mengurangi penggunaan plastik, dan mengajak orang lain untuk peduli terhadap kebersihan lingkungan.
                </p>
              </div>
            </details>

            <details className="group bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                  Berapa lama waktu yang dibutuhkan untuk menindaklanjuti laporan?
                </span>
                <span className="text-green-600 text-2xl font-light transition-transform group-open:rotate-45 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tim kami akan meninjau laporan dalam 1x24 jam. Setelah disetujui, petugas akan ditugaskan untuk melakukan pengangkutan sampah sesuai prioritas dan lokasi.
                </p>
              </div>
            </details>

            <details className="group bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                  Apakah saya bisa melacak status laporan saya?
                </span>
                <span className="text-green-600 text-2xl font-light transition-transform group-open:rotate-45 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Saat ini Anda dapat melihat status laporan melalui halaman Laporan di website kami. Di masa mendatang, kami akan menambahkan fitur pelacakan dengan notifikasi via email atau WhatsApp.
                </p>
              </div>
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
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl mx-4 p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-light"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-6 sm:mb-8">Buat Laporan</h2>

            {/* Form */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Judul */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Judul Laporan *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Sampah Menumpuk di Jalan..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Lokasi *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Contoh: Jl. Sudirman No. 123"
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="px-3 sm:px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    {loadingLocation ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Loading...</span>
                      </>
                    ) : (
                      <>
                        📍
                        <span className="hidden sm:inline">Ambil Lokasi</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Klik tombol untuk menggunakan lokasi GPS Anda
                </p>
              </div>

              {/* Deskripsi Laporan */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Deskripsi Laporan *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan kondisi sampah liar yang anda temukan"
                  rows="5"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Upload Foto</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary-600 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-700 text-sm sm:text-lg">
                      Drag & Drop file anda atau <span className="text-primary-600 font-semibold">pilih..</span>
                    </p>
                    {formData.photo && (
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">File: {formData.photo.name}</p>
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
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 sm:py-4 rounded-full transition-colors text-base sm:text-lg shadow-lg mt-6 sm:mt-8"
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

