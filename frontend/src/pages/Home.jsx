import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const Home = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReports();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Laporkan Sampah Liar di Sekitar Anda
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Bersama kita ciptakan lingkungan yang lebih bersih dan sehat untuk generasi mendatang
            </p>
            <Link to="/buat-laporan" className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg">
              📝 Buat Laporan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">🗑️</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">Mudah</h3>
              <p className="text-gray-600">Laporkan dengan cepat tanpa perlu login</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
              <div className="text-4xl font-bold text-secondary-600 mb-2">🚛</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">Cepat</h3>
              <p className="text-gray-600">Tim kami segera menindaklanjuti</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">✅</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">Transparan</h3>
              <p className="text-gray-600">Pantau status laporan Anda</p>
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
                  <h3 className="font-semibold text-gray-800 mb-2">{report.location}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{getCategoryLabel(report.category)}</span>
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
    </div>
  );
};

export default Home;

