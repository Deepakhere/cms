// Environment Configuration
const config = {
  development: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "",
    ENVIRONMENT: "development",
    DEBUG: process.env.REACT_APP_DEBUG === "true" || true,
    API_TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL:
      process.env.REACT_APP_API_BASE_URL ||
      "https://pagebuilder-zjf0.onrender.com",
    ENVIRONMENT: "production",
    DEBUG: process.env.REACT_APP_DEBUG === "true" || false,
    API_TIMEOUT: 15000,
  },
};

const getCurrentEnvironment = () => {
  if (process.env.REACT_APP_ENVIRONMENT) {
    return process.env.REACT_APP_ENVIRONMENT;
  }

  return process.env.NODE_ENV === "development" ? "development" : "production";
};

const currentEnv = getCurrentEnvironment();
const currentConfig = config[currentEnv] || config.production;

// Log current configuration in development
if (currentConfig.DEBUG) {
  console.log("🔧 Environment Configuration:", {
    environment: currentEnv,
    apiBaseUrl: currentConfig.API_BASE_URL,
    debug: currentConfig.DEBUG,
  });
}

export default currentConfig;

// Export individual values for convenience
export const { API_BASE_URL, ENVIRONMENT, DEBUG, API_TIMEOUT } = currentConfig;
