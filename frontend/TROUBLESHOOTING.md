# Troubleshooting Guide

## 🚫 CORS Errors

### Problem
Getting CORS (Cross-Origin Resource Sharing) errors when making API calls.

### Solutions

#### For Development (`npm run dev`)
✅ **Already Fixed**: Proxy configuration is set up
- Uses `proxy: "http://localhost:4000"` in package.json
- Uses empty `API_BASE_URL` to leverage Create React App's proxy
- All API calls go through the proxy, avoiding CORS

#### For Production (`npm start`)
- Ensure your backend server has CORS enabled
- Backend should allow your frontend domain in CORS settings

### Check if CORS is Fixed
1. Open browser console (F12)
2. Look for red CORS error messages
3. If you see proxy logs like `[HPM] Proxy created`, it's working

---

## ❌ "map is not a function" Error

### Problem
Getting `TypeError: anchorData.map is not a function` or similar errors.

### Root Cause
The data from API is not an array, but `.map()` only works on arrays.

### Solutions Applied

#### ✅ Fixed in AnchorListPage
```javascript
// Before (could fail)
setAnchorData(res.data);

// After (safe)
if (Array.isArray(res.data)) {
  setAnchorData(res.data);
} else {
  setAnchorData([]);
}
```

#### ✅ Added Loading States
- Shows loading spinner while fetching data
- Shows error message if API fails
- Shows "No data" message if array is empty

#### ✅ Error Handling
- Always sets empty array `[]` on API errors
- Prevents crashes when data is not an array

---

## 🔧 API Debugging

### Check API Response
1. Open browser console (F12)
2. Look for debug logs:
   ```
   🔧 Environment Configuration: { environment: 'development', ... }
   🚀 API Request: GET /gethomedata
   ✅ API Response: { status: 200, data: [...] }
   ```

### Common Issues

#### 1. Backend Not Running
**Error**: Network errors, connection refused
**Solution**: Start your backend server on port 4000

#### 2. Wrong API Endpoint
**Error**: 404 Not Found
**Solution**: Check if backend has the correct endpoints

#### 3. Backend Returns Non-Array
**Error**: `map is not a function`
**Solution**: Already fixed with array validation

---

## 🚀 Quick Fixes

### Restart Development Server
```bash
# Kill current server (Ctrl+C)
npm run dev
```

### Check Environment
```bash
# Should show development config
# Look for: API_BASE_URL: ""
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## 📋 Environment Status

### Development Mode (`npm run dev`)
- ✅ Proxy configured for CORS
- ✅ Debug logging enabled
- ✅ Array validation added
- ✅ Error handling improved

### Production Mode (`npm start`)
- ✅ Uses remote API directly
- ✅ Array validation added
- ✅ Error handling improved
- ⚠️ Requires backend CORS configuration

---

## 🆘 Still Having Issues?

1. **Check browser console** for specific error messages
2. **Verify backend is running** on correct port
3. **Test API directly** in browser: `http://localhost:4000/gethomedata`
4. **Check network tab** in DevTools for failed requests
