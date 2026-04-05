import { Link } from 'react-router-dom';
import sapuLogo from '../assets/sapu.png';

const Navbar = () => {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={sapuLogo} alt="SapuKota Logo" className="h-24 sm:h-28 w-auto" />
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-8">
            <Link
              to="/laporan"
              className="text-gray-900 hover:text-primary-500 font-medium transition-colors text-sm sm:text-base"
            >
              Laporan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

