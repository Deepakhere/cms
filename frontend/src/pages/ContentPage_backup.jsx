import React, { useEffect, useState } from "react";
import Sidepanel from "./Sidepanel";
import "./assests/sidepanel.css";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/api";

function ContentPage() {
  const [reacttable, setReactTable] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
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
        // Set empty arrays on error
        setReactTable([]);
        setFilteredData([]);
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

  const handleDelete = (id) => {
    console.log(id);
    apiService.pages
      .delete(id)
      .then((res) => {
        console.log(res.data);
        setReactTable(reacttable.filter((data) => data._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
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
    <div>
      <Sidepanel />
      {reacttable ? (
        <>
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
                {/* <small>Create and publish pages.</small> */}
              </div>
            </div>

            <div className="page-btn">
              <Link to="/home">
                <button className="add-btn">+ Add Page</button>
              </Link>
            </div>
          </div>

          <div className="table-container">
            <div className="filter-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="status-filter">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="All">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              {!filteredData ? (
                "Fetching data, please wait..."
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>URL</th>
                      <th onClick={handleSortCreatedBy}>Created By</th>
                      <th onClick={handleSortCreatedAt}>Created At</th>
                      <th>Modified By</th>
                      <th>Modified At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {" "}
                    {filteredData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.title}</td>
                        <td>{data.URL}</td>
                        <td>{data.createdBy}</td>
                        <td>{formatDateTime(data.createdAt)}</td>
                        <td>{data.modifiedBy}</td>
                        <td>{formatDateTime(data.updatedAt)}</td>
                        <td
                          style={{
                            color: data.status === "draft" ? "#D97706" : "#059669",
                            fontWeight: "bold",
                          }}
                        >
                          {data.status}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(data._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default ContentPage;
