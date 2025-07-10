/**
 * URL Configuration utility for environment-based URLs
 * Handles different URLs for development and production environments
 */

const urlConfig = {
  development: {
    // Development URLs (localhost)
    frontend: "http://localhost:3001",
    backend: "http://localhost:4000",
    generatePage: "http://localhost:4000/generatepage",
  },
  production: {
    // Production URLs (render.com)
    frontend: "https://pagebuilderhere.netlify.app",
    backend: "https://pagebuilder-zjf0.onrender.com",
    generatePage: "https://pagebuilder-zjf0.onrender.com/generatepage",
  },
};

/**
 * Get current environment
 * @returns {string} 'development' or 'production'
 */
export const getCurrentEnvironment = () => {
  // Check for explicit environment variable first
  if (process.env.REACT_APP_ENVIRONMENT) {
    return process.env.REACT_APP_ENVIRONMENT;
  }

  // Check if we're running on localhost
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "development";
  }

  // Default to production for deployed environments
  return "production";
};

/**
 * Get URLs for current environment
 * @returns {object} URL configuration for current environment
 */
export const getUrls = () => {
  const environment = getCurrentEnvironment();
  return urlConfig[environment] || urlConfig.production;
};

/**
 * Get generate page URL for a specific slug
 * @param {string} slug - The page slug/URL
 * @returns {string} Complete URL for the generated page
 */
export const getGeneratePageUrl = (slug) => {
  const urls = getUrls();
  return `${urls.generatePage}/${slug}`;
};

/**
 * Get backend API URL
 * @returns {string} Backend API base URL
 */
export const getBackendUrl = () => {
  const urls = getUrls();
  return urls.backend;
};

/**
 * Get frontend URL
 * @returns {string} Frontend base URL
 */
export const getFrontendUrl = () => {
  const urls = getUrls();
  return urls.frontend;
};

/**
 * Check if we're in development mode
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => {
  return getCurrentEnvironment() === "development";
};

/**
 * Check if we're in production mode
 * @returns {boolean} True if in production
 */
export const isProduction = () => {
  return getCurrentEnvironment() === "production";
};

/**
 * Log current environment info (for debugging)
 */
export const logEnvironmentInfo = () => {
  const environment = getCurrentEnvironment();
  const urls = getUrls();

  console.log("🌍 Environment Info:", {
    environment,
    hostname: window.location.hostname,
    urls,
    isDev: isDevelopment(),
    isProd: isProduction(),
  });
};

// Export default configuration
const urlConfigUtils = {
  getCurrentEnvironment,
  getUrls,
  getGeneratePageUrl,
  getBackendUrl,
  getFrontendUrl,
  isDevelopment,
  isProduction,
  logEnvironmentInfo,
};

export default urlConfigUtils;
