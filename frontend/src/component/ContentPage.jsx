import React from "react";
import Sidepanel from "./Sidepanel";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";
// import _ from 'lodash'

function ContentPage() {
  const [reacttable, setReactTable] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("https://pagebuilder-zjf0.onrender.com/isAuthenticate")
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

  useEffect(() => {
    axios
      .get("https://pagebuilder-zjf0.onrender.com/gethomedata")
      .then((res) => {
        console.log(res.data);
        if (res.data.length === 0) {
          navigate("/norecordpage");
        }
        setReactTable(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => {
        console.log(err);
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
      ", " +
      dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`https://pagebuilder-zjf0.onrender.com/deletedata/${id}`)
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
    console.log(sortedData);
    setReactTable(sortedData);
  };

  const handleSortCreatedAt = () => {
    const sortedData = [...filteredData].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    console.log(sortedData);
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
          <input
            type="text"
            placeholder="Search by Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ float: "right" }}
          >
            <option value="All">All</option>
            <option value="draft">Draft</option>
            <option value="schedule">Schedule</option>
            <option value="published">Published</option>
          </select>
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
                      }}
                    >
                      {data.status}
                    </td>
                    <td>
                      <button
                        type="submit"
                        className="dropdown-toggle"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                      >
                        <img src="./images/dot.svg" alt="" />
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <button className="dropdown-item" type="button">
                          Edit
                        </button>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => handleDelete(data._id)}
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
        </div>
      </div>
    </div>
  );
}

export default ContentPage;
