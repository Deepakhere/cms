import apiService from '../services/api';

// Debug utility to check backend endpoints
export const checkBackendEndpoints = async () => {
  console.log("🔍 Checking backend endpoints...");
  
  const endpoints = [
    '/api/gethomedata',
    '/api/getpagedata/test',
    '/api/homepagedata',
    '/api/pagesavedata',
    '/api/updatepagedata/test',
    '/api/deletedata/test',
  ];

  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      // Use HEAD request to avoid actually creating/modifying data
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}${endpoint}`, {
        method: 'HEAD',
      });
      
      results[endpoint] = {
        available: response.status !== 404,
        status: response.status,
      };
      
      console.log(`${response.status !== 404 ? '✅' : '❌'} ${endpoint} - Status: ${response.status}`);
    } catch (error) {
      results[endpoint] = {
        available: false,
        error: error.message,
      };
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
  
  return results;
};

// Check if specific edit endpoints exist
export const checkEditEndpoints = async () => {
  console.log("🔍 Checking edit-specific endpoints...");
  
  try {
    // Try to get all pages first
    const allPages = await apiService.pages.getAll();
    console.log("✅ getAll endpoint works");
    
    if (allPages.data && allPages.data.length > 0) {
      const firstPageId = allPages.data[0]._id;
      console.log(`📄 Found page with ID: ${firstPageId}`);
      
      // Try to get specific page
      try {
        await apiService.pages.getById(firstPageId);
        console.log("✅ getById endpoint works");
      } catch (error) {
        console.log("❌ getById endpoint not available:", error.response?.status);
      }
      
      // Try to update page (with empty data to avoid actual changes)
      try {
        const formData = new FormData();
        formData.append('title', 'test');
        await apiService.pages.update(firstPageId, formData);
        console.log("✅ update endpoint works");
      } catch (error) {
        console.log("❌ update endpoint not available:", error.response?.status);
      }
    }
  } catch (error) {
    console.log("❌ Error checking edit endpoints:", error);
  }
};

// Auto-run endpoint check in development
if (process.env.NODE_ENV === 'development') {
  // Run checks after a short delay to avoid interfering with app startup
  setTimeout(() => {
    checkBackendEndpoints();
    checkEditEndpoints();
  }, 2000);
}
