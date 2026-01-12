import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import CountUp from '../components/CountUp';
import DomeGallery from '../components/DomeGallery';
import heroImage from '../assets/Img.png';

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

// Gallery images data
const galleryImages = [
  {
    src: 'https://plus.unsplash.com/premium_photo-1686836995135-f55914b7c1b6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VtbWVyJTIwdHJhc2h8ZW58MHx8MHx8fDA%3D',
    alt: 'Abstract art'
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1686836995359-25e4cda25dcb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3VtbWVyJTIwdHJhc2h8ZW58MHx8MHx8fDA%3D',
    alt: 'Modern sculpture'
  },
  {
    src: 'https://images.unsplash.com/photo-1746226389907-ddfce048da9d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyJTIwdHJhc2h8ZW58MHx8MHx8fDA%3D',
    alt: 'Digital artwork'
  },
  {
    src: 'https://images.unsplash.com/photo-1663217299294-27fd4ba85e4b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN1bW1lciUyMHRyYXNofGVufDB8fDB8fHww',
    alt: 'Contemporary art'
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1664283229624-801dd08e8b64?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHN1bW1lciUyMHRyYXNofGVufDB8fDB8fHww',
    alt: 'Geometric pattern'
  },
  {
    src: 'https://images.unsplash.com/photo-1757827467414-35755ca350f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN1bW1lciUyMHRyYXNofGVufDB8fDB8fHww',
    alt: 'Textured surface'
  },
  { 
    src: 'https://images.unsplash.com/photo-1622651463494-7afdc93f0c10?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1bW1lciUyMHRyYXNofGVufDB8fDB8fHww', 
    alt: 'Social media image' 
  }
];

const Home = () => {
  const [recentReports, setRecentReports] = useState(staticReports);
  const [loading, setLoading] = useState(false);
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
    // Uncomment untuk fetch data dari backend
    // fetchRecentReports();
    // fetchStats();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getRecent();
      setRecentReports(response.data);
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
              Bantu menjaga kebersihan dengan melaporkan sampah liar di sekitar Anda.
              <br />
              Setiap laporan akan segera ditindaklanjuti untuk pembersihan dan pemeliharaan lingkungan
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
                <CountUp end={stats.volunteers} duration={2000} />
              </h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Relawan Aktif</p>
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
                              src={`/uploads/${report.photo}`} 
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

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Galeri Lingkungan
          </h2>
          <p className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto">
            Kumpulan foto dokumentasi sampah liar dan upaya pembersihan lingkungan di berbagai lokasi
          </p>
        </div>
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px]">
          <DomeGallery 
            images={galleryImages}
            fit={0.75}
            minRadius={450}
            maxVerticalRotationDeg={13}
            segments={32}
            dragDampening={4.2}
            grayscale={false}
          />
        </div>
      </section>

      {/* Edukasi Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Edukasi Lingkungan
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
              Konten edukasi tentang pengelolaan sampah dan kelestarian lingkungan
            </p>
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-yellow-50 border-2 border-yellow-200 rounded-full">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-800 font-medium text-sm sm:text-base">Sedang Dalam Pengembangan</span>
            </div>
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
                  Ya, Anda dapat melihat status laporan di halaman "Laporan". Status akan diperbarui secara real-time mulai dari pending, disetujui, ditugaskan, dalam proses, hingga selesai.
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
              {/* Judul Laporan */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Judul Laporan</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul laporan"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Lokasi</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Klik tombol untuk ambil lokasi"
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    readOnly
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loadingLocation ? (
                      <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
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
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">Deskripsi Laporan</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan kondisi sampah liar yang anda temukan"
                  rows="5"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
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

