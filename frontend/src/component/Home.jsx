import React from "react";
import Sidepanel from "./Sidepanel";
import { useState, useEffect } from "react";

import JoditEditor from "jodit-react";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function Home() {
  // const [selectedFile, setSelectedFile] = useState();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [subtext, setSubtext] = useState("");
  const [url, setUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [bodyContent, setBodyContent] = useState("");

  const [file, setfile] = useState("");
  const [img, setImg] = useState("");

  const [showAuthor, setShowAuthor] = useState("AuthorName");

  const [checked, setChecked] = useState(false);
  const editor = useRef(null);

  const handleFile = (event) => {
    const getFiles = event.target.files[0];
    setImg(URL.createObjectURL(getFiles));
    setfile(getFiles);
  };

  const handlePublish = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePublishSubmit = (event) => {
    event.preventDefault();
    console.log("Date:", publishDate);
    console.log("Time:", publishTime);
    setShowModal(false);
  };

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:4000/isAuthenticate")
      .then((res) => {
        if (res.data.valid) {
          console.log("Entered Successfully");
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const handlePublishBtn = (event) => {
    console.log("inside");
    setShowModal(false);
    toast.success("Data Saved SuccessFully");

    event.preventDefault();
    axios
      .post("http://localhost:4000/homepagedata", {
        title,
        subtext,
        url,
        bodyContent,
        publishDate,
        publishTime,
        checked,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/gethomedata")
      .then((res) => {
        if (res.data) {
          setShowAuthor(res.data[0].createdBy);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSaveButton = (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("title", title);
    formdata.append("subtext", subtext);
    formdata.append("bodyContent", bodyContent);
    formdata.append("showAuthor", showAuthor);
    formdata.append("url", url);

    console.log(file);

    axios
      .post("http://localhost:4000/pagesavedata", formdata)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="edit-page">
      <Sidepanel />
      <div className="navbar m-1">
        <div className="nav-title">
          <h3>Home Page</h3>
        </div>
        <div className="btn-list" style={{ float: "right" }}>
          <button
            type="submit"
            className="dropdown-toggle"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{
              marginRight: "20px",
              border: "2px solid #C7D2FE",
              borderRadius: "4px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <img src="./images/dot.svg" alt="" />
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <span className="dropdown-item" href="#">
              Preview
            </span>
            <span className="dropdown-item" href="#">
              Delete
            </span>
          </div>
          <button
            className="nav-btn"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#000",
              border: "2px solid #D1D1DB",
            }}
          >
            Cancel
          </button>

          <button
            className="nav-btn"
            style={{ backgroundColor: "#4F46E5", color: "#fff" }}
            onClick={handleSaveButton}
          >
            Save
          </button>

          <button
            className="nav-btn"
            onClick={handlePublish}
            style={{ backgroundColor: "#059669", color: "#fff" }}
          >
            Publish
          </button>
        </div>
      </div>

      <div className="body-container">
        <div className="main-body">
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your Page Title Here..."
                style={{ fontFamily: "unfold" }}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-2">
              <label htmlFor="subtitle">Sub Text</label>
              <input
                type="text"
                className="form-control"
                placeholder="Here Your SubText"
                style={{ fontFamily: "unfold" }}
                onChange={(e) => setSubtext(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="editor-body">
          <p style={{ color: "grey", fontFamily: "unfold" }}>Body</p>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {/* {content} */}
                <JoditEditor
                  ref={editor}
                  value={bodyContent}
                  onChange={(newContent) => setBodyContent(newContent)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="attachment-container mt-2">
          <p style={{ color: "grey", fontFamily: "unfold" }}>Attachments</p>

          <div className="attachment-field">
            {file && (
              <div className="file-container">
                <img
                  src={img}
                  alt="Selected file preview"
                  style={{ maxWidth: "100%", maxHeight: "80px" }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="choose-btn"
            />
          </div>
        </div>
      </div>

      <div className="rightside-bar">
        <div className="">
          <h2>Configuration</h2>
        </div>
        <div className="">
          <div class="form-group">
            <label htmlFor="url" className="url">
              URL
            </label>
            <input
              type="text"
              className="form-control"
              id="url"
              placeholder="Your Page Title Here..."
              style={{ fontFamily: "unfold" }}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={showAuthor}
              style={{ fontFamily: "unfold" }}
            />
          </div>
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input contentclass"
              id="exampleCheck1"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Show Author
            </label>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-top">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Publish</h2>
            </div>

            <form onSubmit={handlePublishSubmit}>
              <div className="form-group">
                <label
                  htmlFor="publishDate"
                  style={{ marginLeft: "22px", marginTop: "10px" }}
                >
                  Publish Date:
                </label>
                <input
                  type="date"
                  id="publishDate"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="publishTime"
                  style={{ marginLeft: "22px", marginTop: "10px" }}
                >
                  Publish Time:
                </label>
                <input
                  type="time"
                  id="publishTime"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="publish-btn"
                  onClick={handlePublishBtn}
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
