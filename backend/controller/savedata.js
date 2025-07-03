import homePageDataSchema from "../models/home_schema_models.js";
import RegisterModel from "../models/user_models.js";
import cloudinary from "./cloudsetup.js";

const pageSaveData = (req, res) => {
  try {
    const { title, subtext, bodyContent } = req.body;

    const filePath = req.file.path;

    cloudinary.uploader
      .upload(filePath, async (err, result) => {
        const userData = req.session.userData;

        RegisterModel.findOne({ _id: userData._id }).then((user) => {
          console.log(user._id);
          if (user) {
            homePageDataSchema
              .create({
                creatorId: user._id,
                title: title,
                subtext: subtext,
                bodyContent: bodyContent,
                files: result.secure_url,
              })
              .then((result) => {
                res.status(201).json("Data Save Successfully");
              })
              .catch((err) => {
                console.log("Error in Saving Data to the Database ", err);
                res.status(500).json("Server Error! Please Try Again Later.");
              });
          } else {
            res.status(404).json("User not found");
          }
        });
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json("Server Error! Please Try Again Later.");
      });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export default pageSaveData;
