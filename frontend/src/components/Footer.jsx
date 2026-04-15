import sapuLogo from '../assets/sapu.png';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <img src={sapuLogo} alt="SapuKota Logo" className="h-8 w-auto" />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">
              Sistem pelaporan sampah liar untuk kota yang lebih bersih dan sehat.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Kontak</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <li>Email: sapukotaid@gmail.com</li>
              <li>WhatsApp: 0877-2077-5950</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Jam Operasional</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <li>Senin - Jumat: 08:00 - 17:00</li>
              <li>Sabtu: 08:00 - 12:00</li>
              <li>Minggu & Libur: Tutup</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; 2026 Dinas Lingkungan Hidup. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

