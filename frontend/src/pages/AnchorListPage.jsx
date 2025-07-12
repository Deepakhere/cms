import React, { useEffect, useState } from "react";
import Sidepanel from "./Sidepanel";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../services/api";
import { getGeneratePageUrl, logEnvironmentInfo } from "../utils/urlConfig";
import "../styles/AnchorListPage.css";

function AnchorListPage() {
  const [anchorData, setAnchorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [htmlPages, setHtmlPages] = useState([]);

  useEffect(() => {
    // Log environment info for debugging
    logEnvironmentInfo();

    setLoading(true);
    setError(null);

    apiService.pages
      .getAll()
      .then((res) => {
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          const pagesWithUrls = res.data.filter(
            (page) => page.URL && page.URL.trim() !== ""
          );
          setAnchorData(pagesWithUrls);
        } else {
          setAnchorData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching anchor data:", error);
        const errorMessage = "Failed to load pages. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        setAnchorData([]); // Set empty array on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStats = () => {
    const total = anchorData.length;
    const published = anchorData.filter(
      (page) => page.status === "published"
    ).length;
    const draft = anchorData.filter((page) => page.status === "draft").length;
    return { total, published, draft };
  };

  const handleViewPage = async (pageUrl) => {
    try {
      const response = await fetch(getGeneratePageUrl(pageUrl));

      if (response.ok) {
        const data = await response.text(); // Get the HTML content
        console.log(
          "✅ Page data received from backend:",
          data.substring(0, 200) + "..."
        );

        toast.success("Page data loaded successfully!");

        window.open(getGeneratePageUrl(pageUrl), "_blank");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to load page data");
    }
  };

  // useEffect(() => {
  //   const paramsString = anchorData.map((anchor) => {
  //     axios.get(`http://localhost:4000/generatepage/${anchor.URL}`)
  //       .then((res) => {
  //         console.log(res.data); // Handle response as needed
  //         setHtmlPages(res.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   })
  // }, [anchorData]);

  const stats = getStats();

  return (
    <div className="anchor-page-container">
      <div className="anchor-sidebar">
        <Sidepanel />
      </div>

      <div className="anchor-main">
        {/* Header Section */}
        <div className="anchor-header">
          <div className="anchor-header-left">
            <img
              src="./images/Menu.svg"
              alt="Pages"
              className="anchor-header-icon"
            />
            <div>
              <h1 className="anchor-header-title">All Pages</h1>
              <p className="anchor-header-subtitle">
                View and manage your live pages
              </p>
            </div>
          </div>
          <div className="anchor-header-right">
            <Link to="/create-page" className="anchor-add-btn">
              + Add Page
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="anchor-content">
          {/* Stats Section */}
          {!loading && !error && anchorData.length > 0 && (
            <div className="stats-section">
              <div className="stat-card">
                <h3 className="stat-number">{stats.total}</h3>
                <p className="stat-label">Total Pages</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">{stats.published}</h3>
                <p className="stat-label">Published</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">{stats.draft}</h3>
                <p className="stat-label">Draft</p>
              </div>
            </div>
          )}
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your pages...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <h3 className="error-title">Error Loading Pages</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && anchorData.length === 0 && (
            <div className="empty-state">
              <svg
                className="empty-state-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="empty-state-title">No Published Pages Found</h3>
              <p className="empty-state-description">
                It looks like you haven't published any pages yet. Create your
                first page to get started!
              </p>
              <div className="empty-state-actions">
                <Link to="/create-page" className="anchor-add-btn">
                  + Create Your First Page
                </Link>
              </div>
            </div>
          )}

          {/* Pages Grid */}
          {!loading && !error && anchorData.length > 0 && (
            <div className="cards-grid">
              {anchorData.map((anchor, index) => (
                <div key={anchor._id || index} className="page-card">
                  <div className="page-card-header">
                    <h3 className="page-card-title">
                      {anchor.title || "Untitled Page"}
                    </h3>
                    <div className="page-card-url">
                      {anchor.URL || "No URL"}
                    </div>
                  </div>

                  <div className="page-card-body">
                    <div className="page-card-meta">
                      <div className="page-card-meta-item">
                        <span className="page-card-meta-label">Created By</span>
                        <span className="page-card-meta-value">
                          {anchor.createdBy || "Unknown"}
                        </span>
                      </div>
                      <div className="page-card-meta-item">
                        <span className="page-card-meta-label">Created</span>
                        <span className="page-card-meta-value">
                          {formatDate(anchor.createdAt)}
                        </span>
                      </div>
                      <div className="page-card-meta-item">
                        <span className="page-card-meta-label">Status</span>
                        <span
                          className={`status-badge status-${
                            anchor.status || "draft"
                          }`}
                        >
                          {anchor.status || "draft"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="page-card-footer">
                    {anchor.URL ? (
                      <button
                        onClick={() => handleViewPage(anchor.URL)}
                        className="page-card-btn page-card-btn-primary"
                      >
                        View Page
                      </button>
                    ) : (
                      <span
                        className="page-card-btn page-card-btn-secondary"
                        style={{ opacity: 0.5 }}
                      >
                        No URL Available
                      </span>
                    )}
                    <Link
                      to="/create-page"
                      state={{ editData: anchor }}
                      className="page-card-btn page-card-btn-secondary"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnchorListPage;
