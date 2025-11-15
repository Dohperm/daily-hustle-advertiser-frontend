// src/components/AutoSwitchNavbar.jsx
import React, { useState, useEffect } from "react";

export default function AutoSwitchNavbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`sidebar bg-light p-3 ${
          isMobile ? "d-none d-lg-block" : "d-block"
        }`}
        style={{ width: "250px", position: "fixed" }}
      >
        <h6>Menu</h6>
        <ul className="nav flex-column">
          <li>
            <a className="nav-link" href="#">
              Home
            </a>
          </li>
          <li>
            <a className="nav-link" href="#">
              About
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile Navbar */}
      <nav
        className={`navbar navbar-expand-lg bg-light ${
          isMobile ? "d-lg-none" : "d-none"
        }`}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Brand
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
