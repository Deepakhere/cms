# Simple Environment Setup

## 🎯 Quick Start

### Development Mode (Local API)
```bash
npm run dev
```
- Uses `http://localhost:4000` for API calls
- Debug mode enabled
- Perfect for local development

### Production Mode (Remote API)
```bash
npm start
```
- Uses `https://pagebuilder-zjf0.onrender.com` for API calls
- Debug mode disabled
- Uses production API

## 📁 Environment Files

### `.env.development`
```bash
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### `.env.production`
```bash
REACT_APP_API_BASE_URL=https://pagebuilder-zjf0.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

## 🔧 How It Works

1. **`npm run dev`** → Sets `REACT_APP_ENVIRONMENT=development` → Uses `.env.development`
2. **`npm start`** → Sets `REACT_APP_ENVIRONMENT=production` → Uses `.env.production`

## 🚀 Build Commands

```bash
# Production build
npm run build

# Development build (for testing)
npm run build:dev
```

## ✅ What's Included

- ✅ Centralized API service (`src/services/api.js`)
- ✅ Environment-aware configuration (`src/config/environment.js`)
- ✅ All components updated to use API service
- ✅ Authentication context with environment support
- ✅ Debug logging in development mode
- ✅ Automatic environment detection

## 🎉 Benefits

- **No hardcoded URLs** - Everything is environment-aware
- **Simple commands** - Just `npm start` or `npm run dev`
- **Debug support** - Automatic API logging in development
- **Team friendly** - Consistent setup across developers
