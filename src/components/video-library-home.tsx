
import React from "react";
import { Link } from "react-router-dom";

export function VideoLibraryHome() {
  return (
    <div className="home-wrapper center-box">
      <div style={{ maxWidth: 1100, width: "100%" }}>
        {/* This container centers the buttons over the background image */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <Link to="/user-login" className="btn btn-warning btn-lg">
            User Login
          </Link>
          <Link to="/admin-login" className="btn btn-dark btn-lg">
            Admin Login
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/user-register" className="register-link">
            New User? Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}