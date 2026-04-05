import { ALL_TPS } from '../constants/tpsLocations';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const toRad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Find nearest TPS from given coordinates
 * @param {number} lat - Latitude of report location
 * @param {number} lng - Longitude of report location
 * @returns {Object} Nearest TPS with distance
 */
export const findNearestTPS = (lat, lng) => {
  if (!lat || !lng) return null;

  let nearestTPS = null;
  let minDistance = Infinity;

  ALL_TPS.forEach((tps) => {
    const distance = calculateDistance(lat, lng, tps.lat, tps.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestTPS = {
        ...tps,
        distance: distance
      };
    }
  });

  return nearestTPS;
};

/**
 * Format distance to readable string
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

/**
 * Get priority level based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {Object} Priority information
 */
export const getPriority = (distance) => {
  if (distance <= 0.5) {
    return {
      level: 'high',
      label: 'Tinggi',
      color: 'red',
      description: 'Dalam radius TPS - Prioritas pengambilan'
    };
  } else if (distance <= 3) {
    return {
      level: 'medium',
      label: 'Sedang',
      color: 'yellow',
      description: 'Di luar radius - Evaluasi manual'
    };
  } else {
    return {
      level: 'low',
      label: 'Rendah',
      color: 'green',
      description: 'Jauh dari TPS - Pertimbangan manual'
    };
  }
};
