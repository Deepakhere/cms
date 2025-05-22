import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './component/Home.jsx';
import Login from './component/Login.jsx';
import Signup from './component/Signup.jsx';
import Sidepanel from './component/Sidepanel.jsx';
import Startpage from './component/Startpage.jsx';
import NorecordPage from './component/NorecordPage.jsx'
import ContentPage from "./component/ContentPage.jsx";
import FileUpload from './component/FileUpload.jsx';
import AnchorListPage from './component/AnchorListPage.jsx';

function App() {

  return (
    <div>
      <Router>
      <ToastContainer />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sidepanel" element={<Sidepanel />} />
          <Route path="/startpage" element={<Startpage />} />
          <Route path="/norecordpage" element={<NorecordPage />} />
          <Route path="/contentpage" element={<ContentPage />} />
          <Route path="/fileupload" element={<FileUpload />} />
          <Route path="/" element={<AnchorListPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;