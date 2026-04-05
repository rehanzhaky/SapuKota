const StatusBadge = ({ status, context = 'public' }) => {
  // Status mapping berdasarkan context
  const getStatusConfig = () => {
    if (context === 'admin') {
      // Admin: hanya 2 status (Diproses, Ditolak)
      if (status === 'rejected') {
        return { label: 'Ditolak', color: 'bg-red-100 text-red-800' };
      }
      // pending, approved, assigned, in_progress, completed = Diproses
      return { label: 'Diproses', color: 'bg-blue-100 text-blue-800' };
    }
    
    if (context === 'petugas') {
      // Petugas: 2 status (Diproses, Selesai)
      if (status === 'completed') {
        return { label: 'Selesai', color: 'bg-green-100 text-green-800' };
      }
      // assigned, in_progress = Diproses
      return { label: 'Diproses', color: 'bg-blue-100 text-blue-800' };
    }
    
    // Public: 3 status (Diproses, Selesai, Ditolak)
    if (status === 'completed') {
      return { label: 'Selesai', color: 'bg-green-100 text-green-800' };
    }
    if (status === 'rejected') {
      return { label: 'Ditolak', color: 'bg-red-100 text-red-800' };
    }
    // pending, approved, assigned, in_progress = Diproses
    return { label: 'Diproses', color: 'bg-blue-100 text-blue-800' };
  };

  const config = getStatusConfig();

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

