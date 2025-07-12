const urlConfig = {
  development: {
    frontend: "http://localhost:3001",
    backend: "http://localhost:4000",
    generatePage: "http://localhost:4000/api/generatepage",
  },
  production: {
    frontend: "https://pagebuilderhere.netlify.app",
    backend: "https://pagebuilder-zjf0.onrender.com",
    generatePage: "https://pagebuilder-zjf0.onrender.com/generatepage",
  },
};

export const getCurrentEnvironment = () => {
  if (process.env.REACT_APP_ENVIRONMENT) {
    return process.env.REACT_APP_ENVIRONMENT;
  }

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "development";
  }

  return "production";
};

export const getUrls = () => {
  const environment = getCurrentEnvironment();
  return urlConfig[environment] || urlConfig.production;
};

export const getGeneratePageUrl = (slug = "") => {
  const urls = getUrls();
  const finalSlug = slug.startsWith("/") ? slug.slice(1) : slug;

  return `${urls.generatePage}/${finalSlug}`;
};

export const getBackendUrl = () => {
  const urls = getUrls();
  return urls.backend;
};

export const getFrontendUrl = () => {
  const urls = getUrls();
  return urls.frontend;
};

export const isDevelopment = () => {
  return getCurrentEnvironment() === "development";
};

export const isProduction = () => {
  return getCurrentEnvironment() === "production";
};

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
