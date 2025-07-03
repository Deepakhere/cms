import React from "react";
import "./assests/sidepanel.css";
import { Link } from "react-router-dom";
function Startpage() {
  return (
    <div>
      <div className="body-frame">
        <div className="frame1">
          <div className="frame-text">
            <h2>No Pages Found.</h2>
          </div>

          <div className="frame-smalltext">
            <p>
              Looks like you don't have any pages yet. Let's add a new page.
            </p>
          </div>

          <div className="frame-btn">
            <Link to="/home">
              <button className="add-btn">+Add Page</button>
            </Link>
          </div>
        </div>

        <div className="frame2">
          <img src="./images/girl.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Startpage;
