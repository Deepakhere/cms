import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Sidepanel from "./pages/Sidepanel.jsx";
import Startpage from "./pages/Startpage.jsx";
import NorecordPage from "./pages/NorecordPage.jsx";
import ContentPage from "./pages/ContentPage.jsx";
import FileUpload from "./pages/FileUpload.jsx";
import AnchorListPage from "./pages/AnchorListPage.jsx";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/create-page"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sidepanel"
              element={
                <ProtectedRoute>
                  <Sidepanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/startpage"
              element={
                <ProtectedRoute>
                  <Startpage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/norecordpage"
              element={
                <ProtectedRoute>
                  <NorecordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contentpage"
              element={
                <ProtectedRoute>
                  <ContentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fileupload"
              element={
                <ProtectedRoute>
                  <FileUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AnchorListPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
