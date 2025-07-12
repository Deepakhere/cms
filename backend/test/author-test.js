// Simple test script to verify author functionality
// This is a manual test script - run with: node test/author-test.js

import mongoose from 'mongoose';
import homePageDataSchema from '../models/home_schema_models.js';

// Test data
const testPageData = {
  title: "Test Page with Author",
  subtext: "Testing author functionality",
  bodyContent: "<p>This is a test page to verify author functionality.</p>",
  URL: "test-author-page",
  showAuthor: true,
  authorName: "Test Author Name",
  status: "draft",
  isPublished: false,
  createdBy: "Test User",
  modifiedBy: "Test User"
};

async function testAuthorFunctionality() {
  try {
    console.log("🧪 Testing Author Functionality...");
    
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/your-database-name');
    console.log("✅ Connected to MongoDB");
    
    // Create a test page with author
    console.log("📝 Creating test page with author...");
    const createdPage = await homePageDataSchema.create(testPageData);
    console.log("✅ Page created with ID:", createdPage._id);
    console.log("📄 Author Name:", createdPage.authorName);
    
    // Retrieve the page to verify author is saved
    console.log("🔍 Retrieving page to verify author...");
    const retrievedPage = await homePageDataSchema.findById(createdPage._id);
    console.log("✅ Page retrieved");
    console.log("📄 Retrieved Author Name:", retrievedPage.authorName);
    console.log("👤 Show Author:", retrievedPage.showAuthor);
    
    // Update the page with new author
    console.log("📝 Updating page with new author...");
    const updatedPage = await homePageDataSchema.findByIdAndUpdate(
      createdPage._id,
      { 
        authorName: "Updated Author Name",
        modifiedBy: "Test User Updated"
      },
      { new: true }
    );
    console.log("✅ Page updated");
    console.log("📄 Updated Author Name:", updatedPage.authorName);
    console.log("👤 Modified By:", updatedPage.modifiedBy);
    
    // Test getting all pages to verify author is included
    console.log("📋 Getting all pages to verify author inclusion...");
    const allPages = await homePageDataSchema.find({}).limit(5);
    console.log("✅ Retrieved", allPages.length, "pages");
    
    allPages.forEach((page, index) => {
      console.log(`📄 Page ${index + 1}:`);
      console.log(`   Title: ${page.title}`);
      console.log(`   Author: ${page.authorName || 'No author'}`);
      console.log(`   Show Author: ${page.showAuthor}`);
      console.log(`   Created By: ${page.createdBy}`);
    });
    
    // Clean up - remove test page
    console.log("🧹 Cleaning up test data...");
    await homePageDataSchema.findByIdAndDelete(createdPage._id);
    console.log("✅ Test page deleted");
    
    console.log("🎉 Author functionality test completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the test
testAuthorFunctionality();
