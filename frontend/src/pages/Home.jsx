import React, { useState, useEffect, useCallback } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Sidepanel from "./Sidepanel";
import apiService from "../services/api";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtext, setSubtext] = useState("");
  const [url, setUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [file, setfile] = useState("");
  const [img, setImg] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showAuthor, setShowAuthor] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const location = useLocation();

  // TinyMCE editor change handler
  const handleEditorChange = useCallback((content) => {
    setBodyContent(content);
  }, []);

  // TinyMCE Editor component
  const renderEditor = () => {
    // Show loading while fetching edit data
    if (isLoadingEditData) {
      return (
        <div className="editor-loading-container">
          <div className="editor-loading-spinner"></div>
        </div>
      );
    }

    // TinyMCE Editor with error handling
    try {
      return (
        <Editor
          apiKey="rhxta1pv0hiyzwu3k112onsn9ur4c3rhc4052xxczkdcz9x5"
          key={editMode ? `edit-${editId}` : "create-new"}
          value={bodyContent || ""}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "insertdatetime",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link | removeformat | help",
            content_style:
              'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.6; }',
            placeholder: "Start typing your content here...",
            branding: false,
            statusbar: false,
            resize: false,
            setup: (editor) => {
              editor.on("init", () => {
                // Editor initialized successfully
              });
            },
          }}
          onEditorChange={handleEditorChange}
        />
      );
    } catch (error) {
      console.error("❌ TinyMCE Editor Error:", error);
      toast.error("Editor failed to load.");
      return (
        <textarea
          value={bodyContent || ""}
          onChange={(e) => setBodyContent(e.target.value)}
          placeholder="Start typing your content here..."
          className="editor-fallback-textarea"
        />
      );
    }
  };

  const handleFile = (event) => {
    const getFiles = event.target.files[0];
    if (getFiles) {
      setImg(URL.createObjectURL(getFiles));
      setfile(getFiles);
    }
  };

  const handleSaveButton = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!title || !url) {
      toast.error("Title and URL are required!");
      return;
    }

    setIsSavingDraft(true);

    try {
      const formdata = new FormData();

      // Only append image if file is selected
      if (file) {
        formdata.append("image", file);
      }

      formdata.append("title", title);
      formdata.append("subtext", subtext);
      formdata.append("bodyContent", bodyContent);
      formdata.append("authorName", authorName);
      formdata.append("showAuthor", showAuthor);
      formdata.append("url", url);
      formdata.append("publishDate", publishDate);
      formdata.append("publishTime", publishTime);
      formdata.append("status", "draft"); // Mark as draft

      // Choose API method based on edit mode
      if (editMode) {
        // For edit mode, try update first, fallback to save
        try {
          await apiService.pages.update(editId, formdata);
          toast.success("Draft saved successfully!");
        } catch (updateError) {
          console.log("Update endpoint not available, using save instead");
          await apiService.pages.save(formdata);
          toast.success("Draft saved successfully!");
        }
      } else {
        // For create mode, use save
        await apiService.pages.save(formdata);
        toast.success("Draft saved successfully!");
      }

      // Navigate to content page after successful save
      navigate("/contentpage");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublishBtn = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!title || !url) {
      toast.error("Title and URL are required!");
      return;
    }

    setShowModal(false);
    setIsPublishing(true);

    try {
      const formdata = new FormData();

      // Only append image if file is selected
      if (file) {
        formdata.append("image", file);
      }

      formdata.append("title", title);
      formdata.append("subtext", subtext);
      formdata.append("url", url);
      formdata.append("bodyContent", bodyContent);
      formdata.append("authorName", authorName);
      formdata.append("showAuthor", showAuthor);
      formdata.append("publishDate", publishDate);
      formdata.append("publishTime", publishTime);

      // Check if this is scheduled or immediate publish
      const isScheduled = publishDate && publishTime;

      if (isScheduled) {
        formdata.append("status", "scheduled");
        formdata.append("isPublished", false);
      } else {
        formdata.append("status", "published");
        formdata.append("isPublished", true);
      }

      if (editMode && editId) {
        // For edit mode, try update first, fallback to save
        try {
          await apiService.pages.update(editId, formdata);
        } catch (updateError) {
          console.log("Update endpoint not available, using save instead");
          await apiService.pages.save(formdata);
        }
      } else {
        // For create mode, use create or save
        try {
          await apiService.pages.create(formdata);
        } catch (createError) {
          console.log("Create endpoint not available, using save instead");
          await apiService.pages.save(formdata);
        }
      }

      // Show appropriate success message
      if (isScheduled) {
        toast.success("Your page is scheduled successfully!");
      } else {
        toast.success("Page published successfully!");
      }

      // Navigate to content page after successful publish/schedule
      navigate("/contentpage");
    } catch (error) {
      console.error("Error publishing page:", error);
      toast.error("Failed to publish page. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(location.search);
    const editPageId = urlParams.get("edit");

    if (editPageId) {
      // Entering edit mode
      setEditMode(true);
      setEditId(editPageId);

      // Load existing page data
      const loadPageData = async () => {
        setIsLoadingEditData(true);
        try {
          // Get specific page by ID using the new endpoint
          const pageResponse = await apiService.pages.getById(editPageId);

          if (!pageResponse.data || !pageResponse.data.data) {
            throw new Error(`Page not found with ID: ${editPageId}`);
          }

          const pageData = pageResponse.data.data;

          // Set form data immediately
          setTitle(pageData.title || "");
          setSubtext(pageData.subtext || "");
          setUrl(pageData.URL || "");
          setAuthorName(
            pageData.authorName || pageData.createdBy || "Your Name"
          );
          setShowAuthor(pageData.showAuthor || false);
          setPublishDate(pageData.publishDate || "");
          setPublishTime(pageData.publishTime || "");
          // Handle image if exists
          if (pageData.img) {
            setImg(pageData.img);
          }

          // Set body content with a small delay to ensure editor is ready
          setTimeout(() => {
            setBodyContent(pageData.bodyContent || "");
          }, 100);
        } catch (error) {
          toast.error(
            "Failed to load page data. You can still create a new page."
          );
          // Don't prevent the user from using the form, just show it empty
        } finally {
          setIsLoadingEditData(false);
        }
      };

      loadPageData();
    } else {
      // Not in edit mode - reset to create mode
      setEditMode(false);
      setEditId(null);
      setIsLoadingEditData(false);

      // Reset form to defaults
      setTitle("");
      setSubtext("");
      setUrl("");
      setBodyContent("");
      setAuthorName("Your Name");
      setShowAuthor(false);
      setPublishDate("");
      setPublishTime("");
      setImg("");
      setfile("");
    }
  }, [location.search]);

  return (
    <div className="layout-container">
      {/* Left Sidebar - spans full height */}
      <div className="layout-sidebar">
        <Sidepanel />
      </div>

      {/* Top Header - spans center and right */}
      <div className="layout-header">
        <h3 className="page-title">
          {editMode ? "Edit Page" : "Create New Post"}
        </h3>
        <div className="header-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/contentpage")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!title) {
                toast.error("Please add a title to preview the page");
                return;
              }
              // Open a preview modal or new window
              const previewContent = `
                <html>
                  <head>
                    <title>${title}</title>
                    <style>
                      body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                      h1 { color: #333; }
                      h2 { color: #666; }
                      img { max-width: 100%; height: auto; }
                    </style>
                  </head>
                  <body>
                    <h1>${title}</h1>
                    ${subtext ? `<h2>${subtext}</h2>` : ""}
                    ${img ? `<img src="${img}" alt="Featured image" />` : ""}
                    <div>${bodyContent || "<p>No content yet...</p>"}</div>
                    ${
                      showAuthor
                        ? `<p><small>By: ${authorName}</small></p>`
                        : ""
                    }
                  </body>
                </html>
              `;
              const previewWindow = window.open("", "_blank");
              previewWindow.document.write(previewContent);
              previewWindow.document.close();
            }}
            className="btn-preview"
          >
            Preview
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={handleSaveButton}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <span className="button-spinner"></span>
            ) : (
              "Save Draft"
            )}
          </button>
          <button
            type="button"
            className="btn-publish"
            onClick={() => setShowModal(true)}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Center Content Area */}
      <div className="layout-center layout-center-relative">
        {/* Loading overlay for edit mode */}
        {isLoadingEditData && (
          <div className="main-loading-overlay">
            <div className="main-loading-spinner"></div>
          </div>
        )}

        {/* Main Content Form */}
        <div className="content-form">
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Subtitle Input */}
          <div className="form-group">
            <label className="form-label">Subtitle</label>
            <input
              type="text"
              className="subtitle-input"
              placeholder="Enter post subtitle..."
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
            />
          </div>

          {/* Content Editor */}
          <div className="content-editor-group">
            <label className="content-editor-label">Content</label>
            <div className="editor-wrapper">{renderEditor()}</div>
          </div>

          {/* Image Upload Section */}
          <div className="image-upload-group">
            <label className="image-upload-label">
              Featured Image (Optional)
            </label>
            {file && (
              <div className="image-preview-container">
                <img
                  src={img}
                  alt="Selected file preview"
                  className="image-preview-img"
                />
                <button
                  type="button"
                  className="image-remove-overlay-btn"
                  onClick={() => {
                    setfile("");
                    setImg("");
                    // Reset the file input
                    const fileInput =
                      document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = "";
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="file-input-field"
              />
            </div>
            {!file && (
              <small className="file-status-no-file">
                No image selected. Page will be saved without a featured image.
              </small>
            )}
            {file && (
              <small className="file-status-selected">
                ✓ Image selected: {file.name}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - URL and Author Settings */}
      <div className="layout-right">
        <div className="settings-section">
          <h6 className="settings-heading">Page Settings</h6>

          {/* URL Setting */}
          <div className="settings-url-group">
            <label className="settings-url-label">Page URL</label>
            <input
              type="text"
              className="settings-url-input"
              placeholder="/page-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <small className="settings-url-help">
              This will be the URL path for your page
            </small>
          </div>

          {/* Author Settings */}
          <div className="settings-author-group">
            <label className="settings-author-label">Author Settings</label>

            {/* Author Name Input */}
            <div className="author-input-container">
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter author name"
                className="settings-input"
                style={{ marginBottom: "8px" }}
              />
            </div>

            {/* Show Author Checkbox */}
            <div className="author-checkbox-container">
              <input
                type="checkbox"
                id="showAuthor"
                checked={showAuthor}
                onChange={(e) => setShowAuthor(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="showAuthor" className="author-checkbox-label">
                Show author information
              </label>
            </div>

            {/* Author Preview */}
            {showAuthor && authorName && (
              <div className="author-info-display">
                <small className="author-info-text">
                  Preview: By {authorName}
                </small>
              </div>
            )}
          </div>

          {/* Publish Date/Time */}
          <div className="settings-schedule-group">
            <label className="settings-schedule-label">Publish Schedule</label>
            <div className="schedule-date-container">
              <label className="schedule-date-label">Date</label>
              <input
                type="date"
                className="schedule-date-input"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
            <div>
              <label className="schedule-time-label">Time</label>
              <input
                type="time"
                className="schedule-time-input"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Publishing */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Publish Page</h4>
            <div className="modal-details">
              <h5 className="modal-details-heading">Page Details:</h5>
              <p className="modal-details-item">
                <strong>Title:</strong> {title || "No title"}
              </p>
              <p className="modal-details-item">
                <strong>URL:</strong> {url || "No URL specified"}
              </p>
              <p className="modal-details-item">
                <strong>Subtitle:</strong> {subtext || "No subtitle"}
              </p>
              <p className="modal-details-item">
                <strong>Featured Image:</strong> {file ? "Yes" : "No"}
              </p>
              <p className="modal-details-item">
                <strong>Author:</strong>{" "}
                {showAuthor && authorName ? authorName : "Not shown"}
              </p>
              {publishDate && (
                <p className="modal-details-item">
                  <strong>Publish Date:</strong> {publishDate}{" "}
                  {publishTime && `at ${publishTime}`}
                </p>
              )}
            </div>
            <p className="modal-confirmation-text">
              Are you sure you want to publish this page? It will be available
              at the specified URL.
            </p>
            <div className="modal-button-container">
              <button
                type="button"
                className="btn-cancel modal-cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-publish modal-publish-btn"
                onClick={handlePublishBtn}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <span className="button-spinner"></span>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
