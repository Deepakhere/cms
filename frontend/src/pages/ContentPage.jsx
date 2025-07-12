import React, { useEffect, useState } from "react";
import Sidepanel from "./Sidepanel";
import "./assests/sidepanel.css";
import "../styles/ContentPage.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../services/api";

function ContentPage() {
  const [reacttable, setReactTable] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    apiService.pages
      .getAll()
      .then((res) => {
        console.log(res.data);
        const data = Array.isArray(res.data) ? res.data : [];

        if (data.length === 0) {
          navigate("/norecordpage");
        }
        setReactTable(data);
        setFilteredData(data);
      })
      .catch((err) => {
        console.error("Error fetching pages:", err);
        toast.error("Failed to load pages. Please try again.");
        setReactTable([]);
        setFilteredData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return (
      dateTime.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      dateTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  const handleDeleteClick = (id, title) => {
    setDeleteItemId(id);
    setDeleteItemTitle(title);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteItemId) return;
    setIsDeleting(true);

    apiService.pages
      .delete(deleteItemId)
      .then((res) => {
        console.log(res.data);
        setReactTable(reacttable.filter((data) => data._id !== deleteItemId));
        setFilteredData(
          filteredData.filter((data) => data._id !== deleteItemId)
        );
        toast.success("Page deleted successfully!");
        setShowDeleteModal(false);
        setDeleteItemId(null);
        setDeleteItemTitle("");
      })
      .catch((err) => {
        setIsDeleting(false);
        console.error("Delete error:", err);
        toast.error("Failed to delete page. Please try again.");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteItemTitle("");
  };

  const handleSortCreatedBy = () => {
    const sortedData = [...filteredData].sort((a, b) =>
      a.createdBy.localeCompare(b.createdBy)
    );
    setReactTable(sortedData);
  };

  const handleSortCreatedAt = () => {
    const sortedData = [...filteredData].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setReactTable(sortedData);
  };

  useEffect(() => {
    // Filter data based on search title and selected status
    const filtered = reacttable.filter(
      (data) =>
        data.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        (selectedStatus === "All" || data.status === selectedStatus)
    );
    setFilteredData(filtered);
  }, [reacttable, searchTitle, selectedStatus]);

  return (
    <div className="content-page-container">
      <div className="content-sidebar">
        <Sidepanel />
      </div>

      <div className="content-main">
        {/* Header Section */}
        <div className="content-header">
          <div className="header-left">
            <img src="./images/Menu.svg" alt="Pages" className="header-icon" />
            <div>
              <h1 className="header-title">Pages</h1>
              <p className="header-subtitle">Create and manage your pages</p>
            </div>
          </div>
          <div className="header-right">
            <Link to="/create-page" className="add-page-btn">
              + Add Page
            </Link>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading pages...</p>
            </div>
          ) : (
            <>
              {/* Table Controls */}
              <div className="table-controls">
                <div className="search-filter-group">
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="search-input"
                  />
                  <div className="status-filter">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="status-select"
                    >
                      <option value="All">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="draft">Schedule</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="results-count">
                  {filteredData.length} of {reacttable.length} pages
                </div>
              </div>
              {/* Data Table */}
              {filteredData.length === 0 ? (
                <div className="empty-state">
                  <h3>No pages found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>URL</th>
                      <th className="sortable" onClick={handleSortCreatedBy}>
                        Created By
                      </th>
                      <th className="sortable" onClick={handleSortCreatedAt}>
                        Created At
                      </th>
                      <th>Modified By</th>
                      <th>Modified At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((data, index) => (
                      <tr key={data._id || index}>
                        <td>{data.title}</td>
                        <td>{data.URL}</td>
                        <td>{data.createdBy}</td>
                        <td>{formatDateTime(data.createdAt)}</td>
                        <td>{data.modifiedBy}</td>
                        <td>{formatDateTime(data.updatedAt)}</td>
                        <td>
                          <span
                            className={`status-badge status-${data.status}`}
                          >
                            {data.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/create-page?edit=${data._id}`}
                              className="action-btn edit-btn"
                            >
                              Edit
                            </Link>
                            <button
                              className="action-btn delete-btn"
                              onClick={() =>
                                handleDeleteClick(data._id, data.title)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <svg
                  className="modal-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.914V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.086l-1.586 1.586a1 1 0 01-1.414-1.414L4 11.5V5zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="modal-title">Delete Page</h3>
              </div>
              <p className="modal-message">
                Are you sure you want to delete "
                <strong>{deleteItemTitle}</strong>"? This action cannot be
                undone.
              </p>
              <div className="modal-actions">
                <button
                  className="modal-btn modal-cancel"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn modal-confirm"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  style={{
                    opacity: isDeleting ? 0.7 : 1,
                    cursor: isDeleting ? "not-allowed" : "pointer",
                  }}
                >
                  {isDeleting ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid transparent",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          marginRight: "8px",
                          display: "inline-block",
                        }}
                      ></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentPage;
