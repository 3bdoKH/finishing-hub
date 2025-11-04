// Configuration utility for API and media URLs

// Get the base URL for API calls
export const getApiBaseUrl = () => {
  return "https://winchelmohandes-furniture.online/api";
};

// Get the base URL for media files (images, videos, logos)
export const getMediaBaseUrl = () => {
  // Point media to API base so /api/uploads/* hits Node static
  return "https://winchelmohandes-furniture.online/api";
};

// Helper to construct full media URL
export const getMediaUrl = (path) => {
  if (!path) return null;
  // If path already includes http, return as is
  if (path.startsWith("http")) return path;
  // Otherwise, prepend the base URL
  return `${getMediaBaseUrl()}${path}`;
};

const config = {
  getApiBaseUrl,
  getMediaBaseUrl,
  getMediaUrl,
};

export default config;
