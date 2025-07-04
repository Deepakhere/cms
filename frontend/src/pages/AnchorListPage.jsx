import React, { useEffect, useState } from "react";
import Sidepanel from "./Sidepanel";
import { Link } from "react-router-dom";
import apiService from "../services/api";

function AnchorListPage() {
  const [anchorData, setAnchorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [htmlPages, setHtmlPages] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiService.pages
      .getAll()
      .then((res) => {
        console.log("API Response:", res.data);
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          setAnchorData(res.data);
        } else {
          console.warn("API response is not an array:", res.data);
          setAnchorData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching anchor data:", error);
        setError("Failed to load data. Please try again.");
        setAnchorData([]); // Set empty array on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  return (
    <div>
      <Sidepanel />
      <div className="navbar">
        <div className="" style={{ marginLeft: "14px" }}>
          <div className="page-title">
            <img
              src="./images/Menu.svg"
              alt=""
              height={"28px"}
              width={"28px"}
            />
            <p className="title">Pages</p>
          </div>
        </div>

        <div className="page-btn">
          <Link to="/home">
            <button className="add-btn">+ Add Page</button>
          </Link>
        </div>
      </div>

      <div className="container mt-4 customContainer">
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading pages...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && anchorData.length === 0 && (
          <div
            className="alert alert-warning border-0 shadow-sm"
            role="alert"
            style={{
              backgroundColor: "#fff3cd",
              borderLeft: "4px solid #ffc107",
              borderRadius: "8px",
              padding: "20px",
              margin: "20px 0",
              width: "100%",
            }}
          >
            <div className="d-flex align-items-center justify-content-center" style={{width: "100%"}}>
              <div className="me-3">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#ffc107"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="#ffc107"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="#ffc107"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-grow-1">
                <h5
                  className="alert-heading mb-2"
                  style={{ color: "#856404", fontWeight: "600" }}
                >
                  No Pages Found
                </h5>
                <p
                  className="mb-3"
                  style={{ color: "#856404", marginBottom: "0" }}
                >
                  You haven't created any pages yet. Start building your content
                  by creating your first page.
                </p>
                <div className="mt-3">
                  <Link
                    to="/home"
                    className="btn btn-warning me-2"
                    style={{
                      backgroundColor: "#ffc107",
                      borderColor: "#ffc107",
                      color: "#000",
                      fontWeight: "500",
                      padding: "8px 20px",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="me-2"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Create Your First Page
                  </Link>
                  <Link
                    to="/contentpage"
                    className="btn btn-outline-secondary"
                    style={{
                      borderColor: "#6c757d",
                      color: "#ffffff",
                      padding: "8px 20px",
                    }}
                  >
                    View All Content
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && anchorData.length > 0 && (
          <div className="row">
            {anchorData.map(
              (
                anchor,
                index // Added index as a fallback key
              ) => (
                <div key={index} className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">URL Name: {anchor.URL}</h5>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`https://pagebuilder-zjf0.onrender.com/generatepage/${anchor.URL}`}
                      >
                        <p className="card-text">View Page</p>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnchorListPage;
