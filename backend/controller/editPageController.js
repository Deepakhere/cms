import homePageDataSchema from "../models/home_schema_models.js";
import RegisterModel from "../models/user_models.js";
import cloudinary from "./cloudsetup.js";

// Get single page by ID for editing
const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Getting page by ID:", id);

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid page ID format:", id);
      return res.status(400).json({
        error: "Invalid page ID format",
        message: "Please provide a valid page ID",
      });
    }

    const page = await homePageDataSchema.findById(id);

    if (!page) {
      console.log("❌ Page not found with ID:", id);
      return res.status(404).json({
        error: "Page not found",
        message: "The requested page does not exist",
      });
    }

    console.log("✅ Page found:", page.title);
    res.status(200).json({
      success: true,
      data: page,
      message: "Page retrieved successfully",
    });
  } catch (error) {
    console.error("❌ Error getting page by ID:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve page data",
      details: error.message,
    });
  }
};

// Update existing page
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtext,
      bodyContent,
      url,
      showAuthor,
      authorName,
      publishDate,
      publishTime,
      status,
      isPublished,
    } = req.body;

    console.log("📝 Update Page Request:");
    console.log("Page ID:", id);
    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.filename : "No file provided");

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Invalid page ID format",
        message: "Please provide a valid page ID",
      });
    }

    const userData = req.session.userData;
    if (!userData) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Please log in to update pages",
      });
    }

    // Check if page exists
    const existingPage = await homePageDataSchema.findById(id);
    if (!existingPage) {
      return res.status(404).json({
        error: "Page not found",
        message: "The page you're trying to update does not exist",
      });
    }

    // Function to update page data in database
    const updatePageData = async (fileUrl = null) => {
      try {
        const user = await RegisterModel.findOne({ _id: userData._id });

        if (!user) {
          return res.status(404).json({
            error: "User not found",
            message: "Your user account was not found",
          });
        }

        console.log("User found:", user._id);

        // Prepare update data
        const updateData = {
          modifiedBy: user.name,
          title: title,
          subtext: subtext,
          bodyContent: bodyContent,
          URL: url,
          showAuthor: showAuthor === "true" || showAuthor === true,
          authorName: authorName || existingPage.authorName || "",
          publishDate: publishDate || existingPage.publishDate,
          publishTime: publishTime || existingPage.publishTime,
          status: status || existingPage.status,
          isPublished:
            isPublished === "true" ||
            isPublished === true ||
            existingPage.isPublished,
        };

        console.log("📝 Update data prepared:", {
          title: updateData.title,
          authorName: updateData.authorName,
          status: updateData.status,
          isPublished: updateData.isPublished,
          hasFile: !!fileUrl,
        });

        // Only update file if new file was uploaded
        if (fileUrl) {
          updateData.files = fileUrl;
        }

        const updatedPage = await homePageDataSchema.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );

        console.log("✅ Page updated successfully:", updatedPage._id);
        res.status(200).json({
          success: true,
          message: "Page updated successfully",
          data: updatedPage,
        });
      } catch (error) {
        console.error("❌ Error updating page in database:", error);
        res.status(500).json({
          error: "Database error",
          message: "Failed to update page in database",
        });
      }
    };

    // Check if file was uploaded
    if (req.file && req.file.path) {
      // File uploaded - process with Cloudinary
      const filePath = req.file.path;
      console.log("📁 Processing file upload to Cloudinary...");

      cloudinary.uploader.upload(filePath, (err, result) => {
        if (err) {
          console.error("❌ Cloudinary upload error:", err);
          res.status(500).json({
            error: "File upload failed",
            message: "Failed to upload image. Please try again.",
          });
          return;
        }
        console.log("✅ File uploaded to Cloudinary:", result.secure_url);
        updatePageData(result.secure_url);
      });
    } else {
      // No file uploaded - update without changing file
      console.log(
        "📄 No file uploaded, updating page without changing image..."
      );
      updatePageData();
    }
  } catch (error) {
    console.error("❌ Error in updatePage:", error);
    res.status(500).json({
      error: "Server error",
      message: "An unexpected error occurred while updating the page",
    });
  }
};

export { getPageById, updatePage };
