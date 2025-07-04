import React, { useState } from "react";
import apiService from "../services/api";
function FileUpload() {
  const [file, setFile] = useState();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formdata = new FormData();
    formdata.append("image", file);

    apiService.files
      .upload(formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div className="container">
      <input type="file" onChange={handleFile} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
export default FileUpload;

// upload.single('image')(req, res, (err) => {
//   if (err) {
//       console.error('Error uploading image:', err);
//       return res.status(500).json({ error: 'Image upload failed' });
//   }

//Multer create storage
// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//       cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//   }
// })

// const upload = multer({
//   storage: storage
// })
