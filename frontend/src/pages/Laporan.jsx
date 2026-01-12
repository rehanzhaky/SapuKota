const Laporan = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Laporan Sampah</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Lihat semua laporan sampah liar dari masyarakat</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Halaman Laporan
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 px-4">
            Fitur untuk melihat dan mengelola semua laporan sampah liar
          </p>
          <div className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-yellow-50 border-2 border-yellow-200 rounded-full">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-yellow-800 font-semibold text-base sm:text-lg">Sedang Dalam Pengembangan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
  