/**
 * Helper functions for handling image URLs
 */

/**
 * Get the base URL for the application
 * Removes /api suffix if present to get the correct base URL for uploads
 */
export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  // Remove /api suffix to get base URL
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Get the full URL for an uploaded image
 * @param {string} filename - The filename from the database (e.g., "1234567890.jpg") or full Cloudinary URL
 * @returns {string} Full URL to the image
 */
export const getUploadUrl = (filename) => {
  if (!filename) return '';
  
  // If it's already a full URL (from Cloudinary), return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Otherwise, it's a local filename, construct the URL
  const baseUrl = getBaseUrl();
  return `${baseUrl}/uploads/${filename}`;
};

/**
 * Fallback placeholder image as data URL when image fails to load
 */
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50" y="50" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
