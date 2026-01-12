const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              SK
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Login Admin</h2>
          <p className="text-sm sm:text-base text-white/90">SapuKota.id - Sistem Pelaporan Sampah</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center py-6 sm:py-8">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Halaman Login
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              Fitur login untuk admin dan petugas
            </p>
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-yellow-50 border-2 border-yellow-200 rounded-full">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-800 font-medium text-sm sm:text-base">Sedang Dalam Pengembangan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
              