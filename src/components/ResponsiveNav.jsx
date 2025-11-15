import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggleButton from "./ThemeToggleButton";

const jobssMenu = [
  { to: "/jobss/allcampaigns", label: "Campaigns", icon: "bi-bullseye" },
  { to: "/jobss/my-campaigns", label: "My Campaigns", icon: "bi-list-jobs" },
  { to: "/jobss/new", label: "New Campaign", icon: "bi-plus-circle" },
  {
    to: "/jobss/submissions",
    label: "Review Submissions",
    icon: "bi-check2-square",
  },
];

const mainMenu = [
  { to: "/", label: "Dashboard", icon: "bi-house-door-fill" },
  {
    label: "jobss",
    icon: "bi-briefcase-fill",
    dropdown: true,
    items: jobssMenu,
  },
  { to: "/wallet", label: "Wallet", icon: "bi-wallet2" },
  { to: "/leaderboard", label: "Leaderboard", icon: "bi-trophy" },
  { to: "/plans", label: "Plans", icon: "bi-gem" },
  { to: "/training", label: "Training", icon: "bi-journal-text" },
  { to: "/notifications", label: "Notifications", icon: "bi-bell" },
  { to: "/settings", label: "Settings", icon: "bi-gear" },
  { to: "/support", label: "Support", icon: "bi-headset" },
];

export default function ResponsiveNav() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [jobssOpen, setjobssOpen] = useState(false);

  // Desktop nav with dropdown for "jobss"
  const desktopLinks = (
    <ul className="nav align-items-center gap-1 flex-nowrap mb-0 px-2">
      {mainMenu.map((item, idx) =>
        item.dropdown ? (
          <li key={item.label} className="nav-item dropdown">
            <button
              className="btn btn-ghost nav-link dropdown-toggle d-flex align-items-center"
              onClick={() => setjobssOpen((o) => !o)}
              aria-expanded={jobssOpen}
              aria-haspopup="true"
            >
              <i className={`bi ${item.icon} me-1`} />
              {item.label}
            </button>
            {jobssOpen && (
              <ul className={`dropdown-menu show position-absolute mt-2`}>
                {item.items.map((sub) => (
                  <li key={sub.to}>
                    <NavLink
                      to={sub.to}
                      className="dropdown-item d-flex align-items-center"
                    >
                      <i className={`bi ${sub.icon} me-2`} />
                      {sub.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ) : (
          <li key={item.to || item.label} className="nav-item">
            <NavLink
              to={item.to}
              className="btn btn-ghost nav-link d-flex align-items-center"
            >
              <i className={`bi ${item.icon} me-1`} />
              {item.label}
            </NavLink>
          </li>
        )
      )}
    </ul>
  );

  // Mobile nav: all items as vertical, jobss dropdown appears inline
  const mobileLinks = (
    <ul className="navbar-nav flex-column gap-2">
      {mainMenu.map((item, idx) =>
        item.dropdown ? (
          <li key={item.label}>
            <button
              className="btn btn-ghost d-flex align-items-center w-100"
              onClick={() => setjobssOpen((o) => !o)}
              aria-expanded={jobssOpen}
              type="button"
              tabIndex={0}
            >
              <i className={`bi ${item.icon} me-1`} />
              {item.label}
              <i
                className={`bi ms-auto ${
                  jobssOpen ? "bi-chevron-up" : "bi-chevron-down"
                }`}
              ></i>
            </button>
            {jobssOpen && (
              <div className="ps-3">
                {item.items.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    className="nav-link d-flex align-items-center"
                  >
                    <i className={`bi ${sub.icon} me-2`} />
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
        ) : (
          <li key={item.to || item.label}>
            <NavLink
              to={item.to}
              className="nav-link d-flex align-items-center"
            >
              <i className={`bi ${item.icon} me-1`} />
              {item.label}
            </NavLink>
          </li>
        )
      )}
    </ul>
  );

  return (
    <>
      {/* Desktop */}
      <nav
        className={`header-appbar d-none d-lg-flex align-items-center px-3 shadow-sm`}
        style={{
          background: `linear-gradient(90deg, var(--dh-red), #2d2d44 100%)`,
          color: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1060,
          minHeight: 56,
        }}
      >
        <Link
          to="/"
          className="d-flex align-items-center gap-2 logo text-decoration-none"
        >
          <img src="/logo-placeholder.png" alt="logo" height={32} />
          <strong style={{ color: "var(--dh-red, #e63946)" }}>
            DailyHustle
          </strong>
        </Link>
        <div className="flex-grow-1">{desktopLinks}</div>
        <ThemeToggleButton />
      </nav>
      {/* Mobile */}
      <nav
        className={`navbar navbar-expand-lg d-lg-none px-2 shadow-sm ${
          theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"
        } header-appbar`}
      >
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold"
            style={{ color: "var(--dh-red)" }}
          >
            DailyHustle
          </span>
          <button
            className="navbar-toggler"
            onClick={() => setOpen((prev) => !prev)}
            type="button"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${open ? " show" : ""}`}>
            {mobileLinks}
            <div className="mt-3 mb-2">
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
