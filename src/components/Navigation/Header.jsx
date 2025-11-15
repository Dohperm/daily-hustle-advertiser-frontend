import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Navbar, NavDropdown, Container, Badge } from "react-bootstrap";
import Logo from "../../../public/dailyjhustleimage.png";
const menu = [
  { to: "/", icon: "bi-house-door-fill", label: "Dashboard" },
  { to: "/jobs/allcampaigns", icon: "bi-bullseye", label: "Campaigns" },
  { to: "/jobs/my-campaigns", icon: "bi-list-jobs", label: "My Campaigns" },
  { to: "/jobs/new", icon: "bi-plus-circle", label: "New Campaign" },
   
  { to: "/wallet", icon: "bi-wallet2", label: "Wallet" },
  { to: "/leaderboard", icon: "bi-trophy", label: "Leaderboard" },
  { to: "/plans", icon: "bi-gem", label: "Plans" },
  { to: "/training", icon: "bi-journal-text", label: "Training" },
  { to: "/notifications", icon: "bi-bell", label: "Notifications" },
  { to: "/settings", icon: "bi-gear", label: "Settings" },
  { to: "/support", icon: "bi-headset", label: "Support" },
];

export default function MobileHeader({ user, onLogout }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close on route change
  useEffect(() => {
    setExpanded(false);
  }, [location]);

  // Close on outside click
  useEffect(() => {
    if (!expanded) return;

    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="header-appbar">
      <Navbar
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
        fixed="top"
        className="shadow-sm"
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e9ecef",
          minHeight: "60px",
        }}
      >
        <Container fluid className="px-3">
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="p-0 d-flex align-items-center gap-2"
          >
            <img src={Logo} alt="" height={60} className="rounded" />
            <strong className="text-danger fw-bold">DailyHustle</strong>
          </Navbar.Brand>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-2">
            {/* Notifications */}
            <NavLink
              to="/notifications"
              className="position-relative p-2 text-secondary text-decoration-none"
              style={{ lineHeight: 1 }}
              onClick={() => setExpanded(false)}
              aria-label="Notifications"
            >
              <i
                className={`bi bi-bell fs-5 ${
                  isActive("/notifications") ? "text-danger" : ""
                }`}
              />
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{
                  fontSize: "0.65rem",
                  pointerEvents: "none",
                  boxShadow: "0 1px 3px rgba(220, 38, 38, 0.4)",
                }}
              >
                3
              </Badge>
            </NavLink>

            {/* Avatar Dropdown */}
            <div ref={dropdownRef}>
              <NavDropdown
                align="end"
                title={
                  <div
                    className="rounded-circle overflow-hidden bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 40, height: 40, fontSize: "1.1rem" }}
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span
                      style={{ display: user?.avatarUrl ? "none" : "flex" }}
                    >
                      {(user?.name || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                }
                id="mobile-user-dropdown"
                show={expanded}
                onToggle={setExpanded}
                className="p-0"
              >
                {/* User Header */}
                <div className="p-3 bg-light border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 36, height: 36, fontSize: "0.95rem" }}
                    >
                      {(user?.name || user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="flex-grow-1 text-truncate">
                      <div
                        className="fw-semibold text-dark text-truncate"
                        style={{ maxWidth: "160px" }}
                      >
                        {user?.name || "User"}
                      </div>
                      <small
                        className="text-muted text-truncate d-block"
                        style={{ maxWidth: "160px" }}
                      >
                        {user?.email || "user@example.com"}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Scrollable Menu */}
                <div style={{ maxHeight: "55vh", overflowY: "auto" }}>
                  {menu.map((item) => (
                    <NavDropdown.Item
                      key={item.to}
                      as={NavLink}
                      to={item.to}
                      className={({ isActive }) =>
                        `d-flex align-items-center px-3 py-2 text-secondary text-decoration-none ${
                          isActive ? "bg-danger text-white fw-semibold" : ""
                        }`
                      }
                      onClick={() => setExpanded(false)}
                    >
                      <i className={`bi ${item.icon} me-2`} />
                      {item.label}
                    </NavDropdown.Item>
                  ))}
                </div>

                <NavDropdown.Divider />

                {/* Actions */}
                <NavDropdown.Item
                  as={NavLink}
                  to="/profile"
                  className="d-flex align-items-center px-3 py-2 text-secondary"
                  onClick={() => setExpanded(false)}
                >
                  <i className="bi bi-person me-2" />
                  My Profile
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={NavLink}
                  to="/settings"
                  className="d-flex align-items-center px-3 py-2 text-secondary"
                  onClick={() => setExpanded(false)}
                >
                  <i className="bi bi-gear me-2" />
                  Settings
                </NavDropdown.Item>

                <NavDropdown.Item
                  as="button"
                  className="d-flex align-items-center px-3 py-2 text-danger"
                  onClick={() => {
                    setExpanded(false);
                    onLogout?.();
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Spacer */}
      <div style={{ height: "60px" }} aria-hidden="true" />
    </div>
  );
}
