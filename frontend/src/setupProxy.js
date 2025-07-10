const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Only apply proxy in development environment
  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    app.use(
      "/api",
      createProxyMiddleware({
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
        // Don't remove /api prefix - backend expects it
        pathRewrite: {},
        headers: {
          Connection: "keep-alive",
        },
        onError: (err, req, res) => {
          console.error("Proxy Error:", err.message);
          res.status(500).send("Proxy Error: " + err.message);
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log(
            "Proxying API request:",
            req.method,
            req.url,
            "→",
            proxyReq.path
          );
          // Ensure cookies are forwarded
          if (req.headers.cookie) {
            proxyReq.setHeader("cookie", req.headers.cookie);
          }
        },
        onProxyRes: (proxyRes, req, res) => {
          // Handle cookies in response
          if (proxyRes.headers["set-cookie"]) {
            console.log("Setting cookies:", proxyRes.headers["set-cookie"]);
          }
        },
        logLevel: "debug",
      })
    );
  }
};
