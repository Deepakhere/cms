// Test script for HTML generator
import generateHTMLContent from '../generatepage/generateHTMLContent.js';

// Sample page data for testing
const samplePageData = {
  title: "Welcome to My Blog",
  subtext: "A comprehensive guide to modern web development",
  bodyContent: `
    <h2>Introduction</h2>
    <p>This is a sample blog post that demonstrates the HTML generator functionality. It includes various elements like headings, paragraphs, and lists.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>Responsive design</li>
      <li>Clean typography</li>
      <li>Author information display</li>
      <li>Professional styling</li>
    </ul>
    
    <p>The content is rendered beautifully with proper spacing and typography that makes it easy to read on any device.</p>
    
    <blockquote>
      "Great design is not just what it looks like and feels like. Great design is how it works." - Steve Jobs
    </blockquote>
    
    <h3>Conclusion</h3>
    <p>This HTML generator creates professional-looking pages that are perfect for publishing content online.</p>
  `,
  showAuthor: true,
  authorName: "John Doe",
  files: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  createdBy: "john.doe@example.com",
  publishDate: "2024-01-15",
  publishTime: "10:30"
};

// Generate HTML
console.log("🧪 Testing HTML Generator...");
const generatedHTML = generateHTMLContent(samplePageData);

// Save to file for inspection
import fs from 'fs';
import path from 'path';

const outputPath = path.join(process.cwd(), 'test', 'sample-output.html');
fs.writeFileSync(outputPath, generatedHTML);

console.log("✅ HTML generated successfully!");
console.log("📄 Output saved to:", outputPath);
console.log("🌐 Open the file in a browser to preview the generated page");

// Also log a snippet for quick inspection
console.log("\n📝 Generated HTML Preview (first 500 characters):");
console.log(generatedHTML.substring(0, 500) + "...");
