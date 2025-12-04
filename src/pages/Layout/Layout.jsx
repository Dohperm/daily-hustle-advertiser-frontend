import React, { useState, useEffect, useMemo } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAdvertiserData } from "../hooks/useAppDataContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "/dailyjhustleimage.png";

const BRAND_RED = "#ff4500";

export default function Layout() {
  const { theme, setTheme } = useTheme();
  const { userAppData } = useAdvertiserData();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isDark = theme === "dark";

  // ✅ THEME PALETTE - SAME AS YOUR APP
  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      sidebarBg: isDark ? "#0a0a0a" : "#181c29",
      red: BRAND_RED,
    }),
    [isDark]
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    { to: "/dashboard", icon: "bi-house-door-fill", label: "Dashboard" },
    { to: "/campaigns", icon: "bi-grid-3x3-gap", label: "Campaign Types" },
    { to: "/jobs/allcampaigns", icon: "bi-bullseye", label: "All Campaigns" },
    { to: "/jobs/my-campaigns", icon: "bi-list", label: "My Campaigns" },
    { to: "/jobs/new", icon: "bi-plus-circle", label: "New Campaign" },
    { to: "/wallet", icon: "bi-wallet2", label: "Wallet" },
    { to: "/logout", icon: "bi-box-arrow-in-left", label: "Logout" },
  ];

  const renderNavLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
      end
      onClick={() => {
        if (!isDesktop) setMobileSidebarOpen(false);
      }}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: "10px",
        gap: "10px",
        color: isActive ? "#fff" : "#fff", // ✅ Fixed: Always white text
        textDecoration: "none",
        transition: "all 0.2s",
        fontWeight: isActive ? "600" : "500",
        background: isActive ? palette.red : "transparent",
      })}
    >
      <i className={`bi ${item.icon}`}></i>
      {(isDesktop ? sidebarOpen : true) && <span>{item.label}</span>}
    </NavLink>
  );

  const SidebarToggleBtn = () =>
    isDesktop && (
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        style={{
          position: "fixed",
          top: "13px",
          right: sidebarOpen ? "calc(260px - 58px)" : "10px",
          zIndex: 1050,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: palette.red,
          color: "#fff",
          border: "none",
          boxShadow: "0 2px 10px rgba(40,13,66,0.12)",
          transition: "right 0.25s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <i
          className={`bi ${
            sidebarOpen ? "bi-chevron-left" : "bi-chevron-right"
          }`}
        ></i>
      </button>
    );

  return (
    <div style={{ background: palette.bg, color: palette.text }}>
      {/* MOBILE TOPBAR */}
      {!isDesktop && (
        <header
          className="app-topbar mobile d-flex align-items-center justify-content-between"
          style={{
            background: palette.cardBg,
            borderBottom: `1px solid ${palette.border}`,
            padding: "12px 16px",
            gap: "12px",
          }}
        >
          <button
            className="hamburger-btn"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{
              color: palette.red,
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="logo-topbar d-flex gap-2 align-items-center">
            <img
              src={Logo}
              alt="logo"
              height={42}
              style={{ borderRadius: 9 }}
            />
            <span
              className="fw-bold"
              style={{ color: palette.red, fontSize: "1.22em" }}
            >
              DailyHustle
            </span>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="theme-toggle"
            aria-label="Toggle theme"
            style={{
              color: palette.red,
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            <i
              className={`bi ${theme === "light" ? "bi-moon-stars" : "bi-sun"}`}
            ></i>
          </button>
        </header>
      )}

      {/* DESKTOP SIDEBAR */}
      {isDesktop && (
        <aside
          style={{
            width: sidebarOpen ? "260px" : "0px",
            minWidth: sidebarOpen ? "260px" : "0px",
            transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
            overflowX: sidebarOpen ? "auto" : "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1040,
            background: palette.sidebarBg,
            color: "#fff",
            padding: sidebarOpen ? "25px 20px" : "0px",
            boxShadow: isDark
              ? "2px 0 8px rgba(0,0,0,0.3)"
              : "2px 0 8px rgba(0,0,0,0.1)",
          }}
        >
          <SidebarToggleBtn />
          <div
            className="logo mb-4 d-flex justify-content-center align-items-center gap-2"
            style={{ opacity: sidebarOpen ? 1 : 0 }}
          >
            <img
              src={Logo}
              alt="logo"
              height={54}
              style={{ borderRadius: 12 }}
            />
            {sidebarOpen && (
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#fff",
                }}
              >
                DailyHustle
              </span>
            )}
          </div>
          <nav
            className="nav-links d-flex flex-column gap-1 mt-2"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {menu.map(renderNavLink)}
          </nav>
          <div
            className="user-section mt-5"
            style={{
              paddingTop: "20px",
              borderTop: `1px solid ${isDark ? "#333" : "#555"}`,
              opacity: sidebarOpen ? 1 : 0,
            }}
          >
            {/* <div className="user-info d-flex align-items-center gap-3">
              <div
                className="avatar"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: palette.red,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  flexShrink: 0,
                }}
              >
                {userAppData?.username?.[0]?.toUpperCase() || "U"}
              </div>
              {sidebarOpen && (
                <div>
                  <div
                    className="name fw-bold"
                    style={{ color: "#fff", fontSize: "0.95rem" }}
                  >
                    {userAppData?.username || "User"}
                  </div>
                  <div
                    className="email"
                    style={{
                      fontSize: "0.85rem",
                      color: "#adb5bd",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "150px",
                    }}
                  >
                    {userAppData?.email || "user@dailyhustle.app"}
                  </div>
                </div>
              )}
            </div> */}
            {sidebarOpen && (
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="theme-toggle ms-2 mt-3"
                aria-label="Toggle theme"
                style={{
                  color: "#fff",
                  background: `${palette.red}20`,
                  border: `1px solid ${palette.red}40`,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = `${palette.red}30`;
                }}
                onMouseOut={(e) => {
                  e.target.style.background = `${palette.red}20`;
                }}
              >
                <i
                  className={`bi ${
                    theme === "light" ? "bi-moon-stars" : "bi-sun"
                  }`}
                ></i>
              </button>
            )}
          </div>
        </aside>
      )}

      {/* MOBILE SIDEBAR */}
      {!isDesktop && mobileSidebarOpen && (
        <>
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              width: "80vw",
              maxWidth: "320px",
              background: palette.sidebarBg,
              color: "#fff",
              zIndex: 2000,
              padding: "25px 20px",
              boxShadow: "2px 0 16px 0 rgba(0,0,0,0.15)",
              transition: "left 0.25s",
              overflowY: "auto",
            }}
          >
            <div className="logo mb-4 d-flex justify-content-center align-items-center gap-2">
              <img
                src={Logo}
                alt="logo"
                height={54}
                style={{ borderRadius: 12 }}
              />
              <span
                style={{ fontWeight: "bold", fontSize: "1rem", color: "#fff" }}
              >
                DailyHustle
              </span>
            </div>
            <nav
              className="nav-links mobile-nav-scroll mt-2"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {menu.map(renderNavLink)}
            </nav>
            <div
              className="user-section mt-4"
              style={{
                paddingTop: "20px",
                borderTop: `1px solid ${isDark ? "#333" : "#555"}`,
              }}
            >
              <div className="user-info d-flex align-items-center gap-2">
                <div
                  className="avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: palette.red,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {userAppData?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div
                    className="name fw-bold"
                    style={{ color: "#fff", fontSize: "0.9rem" }}
                  >
                    {userAppData?.username || "User"}
                  </div>
                  <div
                    className="email"
                    style={{
                      fontSize: "0.8rem",
                      color: "#adb5bd",
                    }}
                  >
                    {userAppData?.email || "user@dailyhustle.app"}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div
            className="sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.38)",
              zIndex: 1999,
              transition: "opacity 0.2s",
            }}
          />
        </>
      )}

      {/* MAIN CONTENT */}
      <main
        style={{
          marginLeft: isDesktop && sidebarOpen ? "260px" : "0px",
          transition: "margin-left 0.22s cubic-bezier(.4,0,.2,1)",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
