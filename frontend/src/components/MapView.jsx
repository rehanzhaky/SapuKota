import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ALL_TPS } from '../constants/tpsLocations';
import { getPriority, formatDistance } from '../utils/distance';

// Fix default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for TPS markers (blue)
const tpsIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons for report markers based on priority
const reportIcons = {
  high: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  medium: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  low: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Custom icons for report markers based on status
const statusIcons = {
  pending: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  approved: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  assigned: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  in_progress: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  completed: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  rejected: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Custom icon for petugas start position (when accepting task)
const startPositionIcon = L.divIcon({
  html: '<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 16px; font-weight: bold;">🚩</span></div>',
  className: 'custom-start-icon',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

// Custom icon for petugas end position (when completing task)
const endPositionIcon = L.divIcon({
  html: '<div style="background: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 16px; font-weight: bold;">✓</span></div>',
  className: 'custom-end-icon',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const MapView = ({ reports = [], onReportSelect, colorBy = 'priority', showTPS = true }) => {
  // Center map on Nongsa area (average of TPS coordinates)
  const center = [1.15, 104.12];
  const defaultZoom = 13;

  const handleReportClick = (report) => {
    if (onReportSelect) {
      onReportSelect(report);
    }
  };

  // Log reports for debugging
  useEffect(() => {
    console.log('MapView received reports:', reports.length);
    console.log('Reports data:', reports);
  }, [reports]);

  return (
    <div className="w-full h-full relative">
      <style>{`
        .leaflet-popup-pane {
          z-index: 700 !important;
        }
        .leaflet-container {
          z-index: 0 !important;
        }
        .leaflet-popup {
          margin-bottom: 20px !important;
        }
        .leaflet-popup-tip-container {
          z-index: 700 !important;
        }
        .leaflet-popup-content-wrapper {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
          border-radius: 12px !important;
        }
      `}</style>
      {reports.length === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
          ⚠️ Belum ada laporan dengan koordinat GPS yang ditampilkan di peta
        </div>
      )}
      <MapContainer 
        center={center} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* TPS Markers with Radius Circles */}
        {showTPS && ALL_TPS.map((tps) => (
          <React.Fragment key={tps.id}>
            {/* TPS Marker */}
            <Marker 
              position={[tps.lat, tps.lng]} 
              icon={tpsIcon}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold text-blue-600">{tps.name}</h3>
                  <p className="text-gray-600">Truk: {tps.truck}</p>
                  <p className="text-xs text-gray-500">
                    Koordinat: {tps.lat.toFixed(6)}, {tps.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Radius Circle - High Priority (500m) */}
            <Circle
              center={[tps.lat, tps.lng]}
              radius={500} // 500m in meters
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.15,
                weight: 2,
                opacity: 0.5
              }}
            />
          </React.Fragment>
        ))}

        {/* Report Markers */}
        {reports
          .filter(report => report.latitude && report.longitude)
          .map((report) => {
            // Always calculate priority for popup display
            const priority = getPriority(report.distance_to_tps || 0);
            
            // Choose icon based on colorBy prop
            let icon;
            if (colorBy === 'status') {
              icon = statusIcons[report.status] || statusIcons.pending;
            } else {
              icon = reportIcons[priority.level] || reportIcons.low;
            }

            return (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={icon}
              >
                <Popup maxWidth={280} closeButton={true}>
                  <div className="text-sm">
                    <h3 className="font-bold text-gray-800 mb-2 text-base">{report.title}</h3>
                    <p className="text-gray-600 mb-3 text-xs">{report.location}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Status:</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          report.status === 'completed' ? 'bg-green-100 text-green-700' :
                          report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {report.status === 'completed' ? 'Selesai' :
                           report.status === 'rejected' ? 'Ditolak' :
                           'Diproses'}
                        </span>
                      </div>

                      {report.nearest_tps && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <p className="text-xs font-semibold text-blue-800 mb-1">🚛 TPS Terdekat</p>
                          <p className="text-xs text-blue-900">{report.nearest_tps}</p>
                          <p className="text-xs text-blue-700">Jarak: {formatDistance(report.distance_to_tps)}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Prioritas:</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          priority.level === 'high' ? 'bg-red-100 text-red-700' :
                          priority.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {priority.label}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                        📍 {parseFloat(report.latitude).toFixed(6)}, {parseFloat(report.longitude).toFixed(6)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleReportClick(report)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🔧</span>
                      <span>Kelola Laporan</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Petugas Position Tracking: Start & End Points with Route Line */}
        {reports
          .filter(report => 
            (report.accept_latitude && report.accept_longitude) || 
            (report.complete_latitude && report.complete_longitude)
          )
          .map((report) => {
            const elements = [];
            const hasStart = report.accept_latitude && report.accept_longitude;
            const hasEnd = report.complete_latitude && report.complete_longitude;
            
            // Draw line connecting start and end positions
            if (hasStart && hasEnd) {
              const positions = [
                [report.accept_latitude, report.accept_longitude],
                [report.complete_latitude, report.complete_longitude]
              ];
              
              elements.push(
                <Polyline
                  key={`route-${report.id}`}
                  positions={positions}
                  pathOptions={{
                    color: '#3b82f6',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10'
                  }}
                />
              );
            }
            
            // Marker for start position (when accepting task)
            if (hasStart) {
              elements.push(
                <Marker
                  key={`accept-${report.id}`}
                  position={[report.accept_latitude, report.accept_longitude]}
                  icon={startPositionIcon}
                >
                  <Popup maxWidth={250}>
                    <div className="text-sm">
                      <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <span>🚩</span>
                        <span>Titik Awal - Terima Tugas</span>
                      </h3>
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-700 font-medium">📦 {report.title || report.location}</p>
                        {report.accepted_at && (
                          <p className="text-gray-600">
                            ⏰ {new Date(report.accepted_at).toLocaleString('id-ID')}
                          </p>
                        )}
                        {report.assignedPetugas && (
                          <p className="text-gray-600">👤 {report.assignedPetugas.name}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
                          📍 {parseFloat(report.accept_latitude).toFixed(6)}, {parseFloat(report.accept_longitude).toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            
            // Marker for end position (when completing task)
            if (hasEnd) {
              elements.push(
                <Marker
                  key={`complete-${report.id}`}
                  position={[report.complete_latitude, report.complete_longitude]}
                  icon={endPositionIcon}
                >
                  <Popup maxWidth={250}>
                    <div className="text-sm">
                      <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                        <span>✓</span>
                        <span>Titik Akhir - Selesai</span>
                      </h3>
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-700 font-medium">📦 {report.title || report.location}</p>
                        {report.completed_at && (
                          <p className="text-gray-600">
                            ⏰ {new Date(report.completed_at).toLocaleString('id-ID')}
                          </p>
                        )}
                        {report.assignedPetugas && (
                          <p className="text-gray-600">👤 {report.assignedPetugas.name}</p>
                        )}
                        {report.completion_notes && (
                          <p className="text-gray-600 mt-2">📝 {report.completion_notes}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
                          📍 {parseFloat(report.complete_latitude).toFixed(6)}, {parseFloat(report.complete_longitude).toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            
            return elements;
          })}
      </MapContainer>

      {/* Legend */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h4 className="font-semibold text-sm text-gray-700 mb-3">Legenda Peta</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* TPS Section */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">TPS Resmi:</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-700">Lokasi TPS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-400 bg-red-100 rounded-full"></div>
              <span className="text-xs text-gray-700">Radius Jangkauan 500m</span>
            </div>
          </div>

          {/* Reports Section */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Laporan:</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-700">Dalam Radius (≤500m)</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-700">Sedang (500m-3km)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-700">Jauh (&gt;3km) - Manual</span>
            </div>
          </div>

          {/* Petugas Section */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Tracking Petugas:</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow flex items-center justify-center">
                <span className="text-[8px]">🚩</span>
              </div>
              <span className="text-xs text-gray-700">Titik Awal (Terima)</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center">
                <span className="text-[8px]">✓</span>
              </div>
              <span className="text-xs text-gray-700">Titik Akhir (Selesai)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5" style={{background: 'repeating-linear-gradient(to right, #3b82f6 0, #3b82f6 5px, transparent 5px, transparent 10px)'}}></div>
              <span className="text-xs text-gray-700">Rute Perjalanan</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          Total {ALL_TPS.length} TPS Resmi | {reports.filter(r => r.latitude && r.longitude).length} Laporan Aktif
        </p>
        <p className="text-xs text-amber-600 mt-2 font-medium">
          ⚠️ Laporan di luar radius 500m akan dipertimbangkan secara manual
        </p>
      </div>
    </div>
  );
};

export default MapView;
