import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usersAPI } from '../services/api';

// Custom icon for petugas (person icon)
const petugasIcon = L.divIcon({
  html: `<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 18px;">👤</span>
  </div>`,
  className: 'custom-petugas-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Custom icon for target location (flag icon)
const targetIcon = L.divIcon({
  html: `<div style="background: #ef4444; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 16px;">🚩</span>
  </div>`,
  className: 'custom-target-icon',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const PetugasTrackingMap = () => {
  const [petugasLocations, setPetugasLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const center = [1.15, 104.12]; // Default center
  const defaultZoom = 13;

  useEffect(() => {
    fetchPetugasLocations();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchPetugasLocations();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchPetugasLocations = async () => {
    try {
      const response = await usersAPI.getPetugasLocations();
      setPetugasLocations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching petugas locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeSinceUpdate = (lastUpdate) => {
    if (!lastUpdate) return 'Tidak ada data';
    const diff = Date.now() - new Date(lastUpdate).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    return `${hours} jam lalu`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 relative z-0 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900">Tracking Posisi Petugas</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Tracking</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">Pantau lokasi real-time petugas yang sedang bertugas</p>
      </div>

      {loading ? (
        <div className="h-[500px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500"></div>
        </div>
      ) : (
        <>
          <div className="h-[500px] rounded-lg overflow-hidden mb-4">
            <MapContainer 
              center={center} 
              zoom={defaultZoom} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {petugasLocations.map((petugas) => {
                const hasLocation = petugas.current_latitude && petugas.current_longitude;
                const hasActiveTask = petugas.assignedReports && petugas.assignedReports.length > 0;

                if (!hasLocation) return null;

                return (
                  <React.Fragment key={petugas.id}>
                    {/* Petugas location marker */}
                    <Marker 
                      position={[parseFloat(petugas.current_latitude), parseFloat(petugas.current_longitude)]}
                      icon={petugasIcon}
                    >
                      <Popup>
                        <div className="text-sm p-2">
                          <h4 className="font-bold text-blue-700 mb-2">{petugas.name}</h4>
                          <p className="text-xs text-gray-600 mb-1">📞 {petugas.phone || '-'}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            Update: {getTimeSinceUpdate(petugas.last_location_update)}
                          </p>
                          {hasActiveTask && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Tugas Aktif:</p>
                              {petugas.assignedReports.map((report) => (
                                <div key={report.id} className="text-xs bg-blue-50 rounded p-1 mb-1">
                                  <p className="font-medium">{report.title}</p>
                                  <p className="text-gray-600">{report.location}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>

                    {/* Target locations and routes */}
                    {hasActiveTask && petugas.assignedReports.map((report) => {
                      if (!report.latitude || !report.longitude) return null;

                      return (
                        <React.Fragment key={`target-${report.id}`}>
                          {/* Target marker */}
                          <Marker 
                            position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
                            icon={targetIcon}
                          >
                            <Popup>
                              <div className="text-sm p-2">
                                <h4 className="font-bold text-red-700 mb-1">Target: {report.title}</h4>
                                <p className="text-xs text-gray-600">{report.location}</p>
                                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                                  report.status === 'assigned' ? 'bg-purple-100 text-purple-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  {report.status === 'assigned' ? 'Ditugaskan' : 'Dalam Proses'}
                                </span>
                              </div>
                            </Popup>
                          </Marker>

                          {/* Route line from petugas to target */}
                          <Polyline
                            positions={[
                              [parseFloat(petugas.current_latitude), parseFloat(petugas.current_longitude)],
                              [parseFloat(report.latitude), parseFloat(report.longitude)]
                            ]}
                            color="#3b82f6"
                            weight={3}
                            opacity={0.6}
                            dashArray="10, 10"
                          />
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>

          {/* Petugas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {petugasLocations.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Tidak ada petugas yang sedang aktif
              </div>
            ) : (
              petugasLocations.map((petugas) => {
                const hasLocation = petugas.current_latitude && petugas.current_longitude;
                const hasActiveTask = petugas.assignedReports && petugas.assignedReports.length > 0;

                return (
                  <div key={petugas.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{petugas.name}</h4>
                        <p className="text-xs text-gray-600">{petugas.phone || '-'}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${hasLocation ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    
                    {hasLocation ? (
                      <div className="text-xs text-gray-500 mb-2">
                        📍 Update: {getTimeSinceUpdate(petugas.last_location_update)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mb-2">
                        Tidak ada data lokasi
                      </div>
                    )}

                    {hasActiveTask ? (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          Tugas: {petugas.assignedReports.length} aktif
                        </p>
                        {petugas.assignedReports.slice(0, 2).map((report) => (
                          <div key={report.id} className="text-xs bg-blue-50 rounded p-2 mb-1">
                            {report.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">
                        Tidak ada tugas aktif
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PetugasTrackingMap;
