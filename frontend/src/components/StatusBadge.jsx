const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Disetujui', color: 'bg-blue-100 text-blue-800' },
    assigned: { label: 'Ditugaskan', color: 'bg-purple-100 text-purple-800' },
    in_progress: { label: 'Dalam Proses', color: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

