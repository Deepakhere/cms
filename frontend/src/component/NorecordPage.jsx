import React, { useEffect } from "react";
import Sidepanel from "./Sidepanel";
import Startpage from "./Startpage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NorecordPage() {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
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

  return (
    <div>
      <Sidepanel />
      <Startpage />
    </div>
  );
}

export default NorecordPage;
