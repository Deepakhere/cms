import homePageDataSchema from "../models/home_schema_models.js";
import RegisterModel from "../models/user_models.js";
import cloudinary from "../controller/cloudsetup.js";
import fs from "fs";

const homePageData = (req, res) => {
  try {
    const {
      title,
      subtext,
      bodyContent,
      url,
      publishTime,
      publishDate,
      checked,
      isPublished,
      authorName,
    } = req.body;

    const userData = req.session.userData;

    // Function to save page data to database
    const savePageData = (fileUrl = null) => {
      RegisterModel.findOne({ _id: userData._id })
        .then((user) => {
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
                files: fileUrl,
                URL: url,
                status: "schedule",
                publishTime: publishTime,
                publishDate: publishDate,
                showAuthor: checked,
                authorName: authorName || "",
                isPublished: isPublished,
              })
              .then((result) => {
                console.log("✅ Page published successfully:", result._id);
                res.status(201).json("Data Insert Successfully");
              })
              .catch((err) => {
                console.log("❌ Error in Saving Data to the Database:", err);
                res.status(500).json("Server Error! Please Try Again Later.");
              });
          } else {
            res.status(404).json("User not found");
          }
        })
        .catch((err) => {
          console.error("❌ Error finding user:", err);
          res.status(500).json("Server Error! Please Try Again Later.");
        });
    };

    // Check if file was uploaded
    if (req.file && req.file.path) {
      // Verify file exists before uploading
      if (!fs.existsSync(req.file.path)) {
        console.warn("⚠️ File path does not exist:", req.file.path);
        // Continue without file if path doesn't exist
        savePageData();
        return;
      }

      // File uploaded - process with Cloudinary
      const filePath = req.file.path;

      cloudinary.uploader.upload(filePath, (err, result) => {
        if (err) {
          console.error("❌ Cloudinary upload error:", err);
          savePageData();
          return;
        }

        savePageData(result.secure_url);
      });
    } else {
      savePageData();
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default homePageData;
