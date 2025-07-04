const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Only apply proxy in development environment
  if (process.env.REACT_APP_ENVIRONMENT === 'development') {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:4000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // Remove /api prefix when forwarding to backend
        },
        onError: (err, req, res) => {
          console.error('Proxy Error:', err.message);
          res.status(500).send('Proxy Error: ' + err.message);
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log('Proxying request:', req.method, req.url, '→', proxyReq.path);
        },
        logLevel: 'debug',
      })
    );

    // Proxy all other API requests directly
    app.use(
      ['/login', '/register', '/isAuthenticate', '/logout', '/gethomedata', '/homepagedata', '/pagesavedata', '/deletedata', '/homePageData', '/generatepage'],
      createProxyMiddleware({
        target: 'http://localhost:4000',
        changeOrigin: true,
        onError: (err, req, res) => {
          console.error('Proxy Error:', err.message);
          res.status(500).send('Proxy Error: ' + err.message);
        },
        onProxyReq: (proxyReq, req, res) => {
          console.log('Proxying request:', req.method, req.url, '→', proxyReq.path);
        },
        logLevel: 'debug',
      })
    );
  }
};
