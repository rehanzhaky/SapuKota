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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SK</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              SapuKota.id
            </span>
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                Home
              </Link>
              <Link to="/laporan" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                Laporan
              </Link>
              <Link to="/login" className="btn-primary">
                Login Admin
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'admin_dlh' ? 'Admin DLH' : 'Petugas'}
                </p>
              </div>
              <button onClick={handleLogout} className="btn-outline">
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

