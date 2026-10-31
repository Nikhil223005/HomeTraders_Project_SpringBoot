
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import SuperAdminLogin from "./SuperAdminLogin.jsx";
import SuperAdminDashboard from "./SuperAdminDashboard.jsx";
import SubAdminDashboard from "./SubAdminDashboard.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/superadmin-login"
          element={<SuperAdminLogin />}
        />
        <Route
          path="/superadmin-dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route
          path="/subadmin-dashboard"
          element={<SubAdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
