import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usersAPI } from '../services/api';

// Custom icon for current petugas location
const currentLocationIcon = L.divIcon({
  html: `<div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; position: relative;">
    <span style="color: white; font-size: 24px;">📍</span>
    <div style="position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border-radius: 50%; border: 2px solid #3b82f6; animation: pulse 2s infinite;"></div>
  </div>
  <style>
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
  </style>`,
  className: 'custom-current-location-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Custom icon for destination
const destinationIcon = L.divIcon({
  html: `<div style="background: #ef4444; width: 36px; height: 36px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 20px;">🎯</span>
  </div>`,
  className: 'custom-destination-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

// Component to auto-center map on current location
function MapCenterController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  
  return null;
}

const PetugasNavigationMap = ({ report }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [mapCenter, setMapCenter] = useState([1.15, 104.12]);

  useEffect(() => {
    if (!report || !report.latitude || !report.longitude) return;

    // Request GPS permission and start tracking
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];
          
          setCurrentLocation(newLocation);
          setMapCenter(newLocation);
          setGpsError(null);

          // Calculate distance to destination
          const dist = calculateDistance(
            latitude,
            longitude,
            parseFloat(report.latitude),
            parseFloat(report.longitude)
          );
          setDistance(dist);

          // Send location to backend
          updateBackendLocation(latitude, longitude);
        },
        (error) => {
          console.error('GPS Error:', error);
          setGpsError('Tidak dapat mengakses GPS. Pastikan GPS aktif dan izin diberikan.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      setWatchId(id);

      return () => {
        if (id) {
          navigator.geolocation.clearWatch(id);
        }
      };
    } else {
      setGpsError('GPS tidak tersedia di perangkat ini');
    }
  }, [report]);

  const updateBackendLocation = async (latitude, longitude) => {
    try {
      await usersAPI.updateGPSLocation({
        latitude,
        longitude
      });
    } catch (error) {
      console.error('Error updating GPS location:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const openGoogleMaps = () => {
    if (!report || !report.latitude || !report.longitude) return;
    
    const destination = `${report.latitude},${report.longitude}`;
    const origin = currentLocation ? `${currentLocation[0]},${currentLocation[1]}` : '';
    
    // Google Maps URL with directions
    const url = origin 
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${destination}`;
    
    window.open(url, '_blank');
  };

  if (!report || !report.latitude || !report.longitude) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">Laporan ini tidak memiliki koordinat GPS</p>
      </div>
    );
  }

  const destination = [parseFloat(report.latitude), parseFloat(report.longitude)];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h3 className="text-lg font-bold mb-1">🗺️ Navigasi ke Lokasi</h3>
        <p className="text-sm text-blue-100">{report.title}</p>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Status GPS</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${currentLocation ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-semibold text-gray-900">
                {currentLocation ? 'Aktif' : 'Mencari...'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Jarak ke Lokasi</p>
            <p className="text-sm font-bold text-blue-600">
              {distance !== null ? formatDistance(distance) : '-'}
            </p>
          </div>
        </div>

        {gpsError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-700">⚠️ {gpsError}</p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-[400px] relative">
        <MapContainer 
          center={mapCenter} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapCenterController center={mapCenter} />

          {/* Current Location Marker */}
          {currentLocation && (
            <Marker position={currentLocation} icon={currentLocationIcon}>
              <Popup>
                <div className="text-sm p-2">
                  <p className="font-bold text-blue-700 mb-1">📍 Lokasi Anda</p>
                  <p className="text-xs text-gray-600">Pembaruan real-time aktif</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          <Marker position={destination} icon={destinationIcon}>
            <Popup>
              <div className="text-sm p-2">
                <p className="font-bold text-red-700 mb-1">🎯 Tujuan</p>
                <p className="text-xs font-medium">{report.title}</p>
                <p className="text-xs text-gray-600 mt-1">{report.location}</p>
              </div>
            </Popup>
          </Marker>

          {/* Route Line */}
          {currentLocation && (
            <Polyline
              positions={[currentLocation, destination]}
              color="#3b82f6"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>

        {/* Distance Overlay */}
        {distance !== null && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 border-2 border-blue-500 z-[1000]">
            <p className="text-center">
              <span className="text-xs text-gray-600 block">Jarak:</span>
              <span className="text-lg font-bold text-blue-600">{formatDistance(distance)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openGoogleMaps}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🧭</span>
            <span>Buka Google Maps</span>
          </button>
          
          <button
            onClick={() => setMapCenter(currentLocation || mapCenter)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            disabled={!currentLocation}
          >
            <span>📍</span>
            <span>Pusatkan Lokasi</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600">
            📌 Lokasi Anda diperbarui secara otomatis
          </p>
        </div>
      </div>

      {/* Destination Info */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <p className="text-xs text-gray-700 font-semibold mb-1">Alamat Tujuan:</p>
        <p className="text-sm text-gray-900">{report.location}</p>
      </div>
    </div>
  );
};

export default PetugasNavigationMap;
