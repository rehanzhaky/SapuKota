const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              SapuKota.id
            </h3>
            <p className="text-gray-300 text-sm">
              Sistem pelaporan sampah liar untuk kota yang lebih bersih dan sehat.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: info@sapukota.id</li>
              <li>Telp: (021) 1234-5678</li>
              <li>WhatsApp: 0812-3456-7890</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Jam Operasional</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Senin - Jumat: 08:00 - 17:00</li>
              <li>Sabtu: 08:00 - 12:00</li>
              <li>Minggu & Libur: Tutup</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2026 SapuKota.id - Dinas Lingkungan Hidup. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

