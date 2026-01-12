import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">Logo</span>
          </Link>

          {/* Navigation */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-3 sm:space-x-8">
              <Link
                to="/laporan"
                className="text-gray-900 hover:text-primary-500 font-medium transition-colors text-sm sm:text-base"
              >
                Laporan
              </Link>
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 sm:px-8 py-2 sm:py-2.5 rounded-full transition-colors text-sm sm:text-base"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {user.role === 'admin_dlh' ? 'Admin DLH' : 'Petugas'}
                </p>
              </div>
              <button onClick={handleLogout} className="btn-outline text-sm sm:text-base px-4 sm:px-6 py-2">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

