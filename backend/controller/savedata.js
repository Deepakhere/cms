import homePageDataSchema from "../models/home_schema_models.js";
import RegisterModel from "../models/user_models.js";
import cloudinary from "./cloudsetup.js";

const pageSaveData = (req, res) => {
  try {
    const { title, subtext, bodyContent, url, showAuthor } = req.body;

    console.log("📝 Page Save Data Request:");
    console.log("Body:", req.body);
    console.log("URL:", url);
    console.log("File:", req.file ? req.file.filename : "No file provided");

    const userData = req.session.userData;

    // Function to save page data to database
    const savePageData = (fileUrl = null) => {
      RegisterModel.findOne({ _id: userData._id }).then((user) => {
        console.log("User found:", user._id);
        if (user) {
          homePageDataSchema
            .create({
              creatorId: user._id,
              createdBy: user.name,
              modifiedBy: user.name,
              title: title,
              subtext: subtext,
              bodyContent: bodyContent,
              files: fileUrl, // Will be null if no file uploaded
              URL: url,
              showAuthor: showAuthor === "true" || showAuthor === true,
              status: "draft",
            })
            .then((result) => {
              console.log("✅ Page saved successfully:", result._id);
              res.status(201).json("Data Save Successfully");
            })
            .catch((err) => {
              console.log("❌ Error in Saving Data to the Database:", err);
              res.status(500).json("Server Error! Please Try Again Later.");
            });
        } else {
          res.status(404).json("User not found");
        }
      }).catch((err) => {
        console.error("❌ Error finding user:", err);
        res.status(500).json("Server Error! Please Try Again Later.");
      });
    };

    // Check if file was uploaded
    if (req.file && req.file.path) {
      // File uploaded - process with Cloudinary
      const filePath = req.file.path;
      console.log("📁 Processing file upload to Cloudinary...");

      cloudinary.uploader
        .upload(filePath, (err, result) => {
          if (err) {
            console.error("❌ Cloudinary upload error:", err);
            res.status(500).json("File upload failed. Please try again.");
            return;
          }
          console.log("✅ File uploaded to Cloudinary:", result.secure_url);
          savePageData(result.secure_url);
        });
    } else {
      // No file uploaded - save without file
      console.log("📄 No file uploaded, saving page without image...");
      savePageData();
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export default pageSaveData;
