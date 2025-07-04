# Environment Setup Guide

This guide explains how to set up and manage environments for the CMS frontend application.

## 🌍 Environment Overview

The application supports two environments with different API configurations:

- **Development**: Local development with local backend (npm run dev)
- **Production**: Production deployment with remote API (npm start)

## 📁 Environment Files

### `.env.development`
Used when running `npm run dev` (local development)
```bash
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### `.env.production`
Used when running `npm start` (production mode)
```bash
REACT_APP_API_BASE_URL=https://pagebuilder-zjf0.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

## 🚀 Available Scripts

### Available Scripts
```bash
# Production mode (uses remote API)
npm start

# Development mode (uses local API)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `http://localhost:4000` |
| `REACT_APP_ENVIRONMENT` | Environment identifier | `development` |
| `REACT_APP_DEBUG` | Enable debug logging | `false` |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `10000` |

### API Service

The application uses a centralized API service (`src/services/api.js`) that:
- Automatically configures base URL from environment
- Handles authentication cookies
- Provides debug logging in development
- Includes error handling and interceptors

## 🔧 Setup Instructions

### 1. Initial Setup
```bash
# Clone and install dependencies
npm install
```

### 2. Development with Local Backend
```bash
# Start your local backend on port 4000
# Then start frontend in development mode
npm run dev
```

### 3. Development with Production API
```bash
# Start frontend in production mode (uses remote API)
npm start
```

### 4. Production Build
```bash
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows the frontend origin
2. **API Not Found**: Check `REACT_APP_API_BASE_URL` is correct
3. **Environment Not Loading**: Restart development server after changing `.env` files

### Debug Mode

Enable debug mode to see API requests/responses:
```bash
# In .env.local
REACT_APP_DEBUG=true
```

### Check Configuration
```bash
npm run env:check
```

## 📝 Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use environment-specific scripts** for clarity
3. **Test with production API** before deploying
4. **Keep environment files minimal** - only override what's necessary

## 🔗 API Endpoints

The API service provides organized endpoints:

```javascript
// Authentication
apiService.auth.login(credentials)
apiService.auth.register(userData)
apiService.auth.isAuthenticated()
apiService.auth.logout()

// Pages
apiService.pages.getAll()
apiService.pages.create(pageData)
apiService.pages.save(formData)
apiService.pages.delete(id)

// Files
apiService.files.upload(formData)
```

## 🚨 Important Notes

- Environment variables must start with `REACT_APP_`
- Changes to `.env` files require server restart
- Production builds use `.env.production` by default
- Local `.env.local` overrides other environment files
