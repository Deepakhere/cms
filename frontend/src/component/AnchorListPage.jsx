import React, { useEffect, useState } from "react";
import Sidepanel from "./Sidepanel";
import { Link } from "react-router-dom";
import axios from "axios";

function AnchorListPage() {
  const [anchorData, setAnchorData] = useState([]);
  // const [htmlPages, setHtmlPages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/bloglist")
      .then((res) => {
        setAnchorData(res.data);
      })
      .catch((error) => {
        console.log(error);
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
                      to={`http://localhost:4000/generatepage/${anchor.URL}`}
                    >
                      <p className="card-text">View Page</p>
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AnchorListPage;
