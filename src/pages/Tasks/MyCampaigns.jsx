import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { advertiserListMyTasks } from "../services/services";
import { useTheme } from "../../context/ThemeContext";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "inactive", label: "Inactive" },
];

function truncateText(txt, len) {
  if (!txt) return "";
  txt = txt.trim();
  if (txt.length <= len) return txt;
  return txt.slice(0, len - 3) + "...";
}

function stripHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function MyCampaigns() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      red: "#ff4500",
      success: "#28a745",
      warning: "#ffc107",
      secondary: "#6c757d",
    }),
    [isDark]
  );

  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meta, setMeta] = useState({
    total: 0,
    pages: 1,
    limit: 10,
    page: 1,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchCampaigns(pageNum = 1) {
      setLoading(true);
      setError("");
      try {
        const res = await advertiserListMyTasks(pageNum);
        const raw =
          res.data?.data && typeof res.data.data === "object"
            ? res.data.data
            : {};
        const backendMeta = raw.metadata || {};
        const data = Array.isArray(raw.data) ? raw.data : [];

        setMeta({
          limit: backendMeta.limit || 10,
          page: backendMeta.page || 1,
          total: backendMeta.total || data.length,
          pages: backendMeta.pages || 1,
        });
        setCampaigns(data);
        setFiltered(data);
        setPage(backendMeta.page || 1);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load campaigns."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns(1);
  }, []);

  useEffect(() => {
    let arr = [...campaigns];

    if (statusFilter !== "all") {
      arr = arr.filter((c) => {
        if (typeof c.completion_status === "string") {
          return c.completion_status.toLowerCase() === statusFilter;
        }
        if (typeof c.status === "boolean") {
          return statusFilter === "active" ? c.status : !c.status;
        }
        return false;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(q) ||
          (c.category || "").toLowerCase().includes(q) ||
          stripHtml(c.description || "")
            .toLowerCase()
            .includes(q)
      );
    }

    setFiltered(arr);
  }, [search, campaigns, statusFilter]);

  function formatStatus(status, boolStatus) {
    if (typeof status === "string" && status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    if (typeof boolStatus === "boolean")
      return boolStatus ? "Active" : "Inactive";
    return "N/A";
  }

  function statusClass(status, boolStatus) {
    if (typeof status === "string") {
      const s = status.toLowerCase();
      if (s === "active")
        return { bg: palette.success, text: "#fff", label: "Active" };
      if (s === "completed")
        return { bg: palette.secondary, text: "#fff", label: "Completed" };
      if (s === "inactive")
        return { bg: palette.warning, text: "#000", label: "Inactive" };
    }
    if (typeof boolStatus === "boolean") {
      return boolStatus
        ? { bg: palette.success, text: "#fff", label: "Active" }
        : { bg: palette.warning, text: "#000", label: "Inactive" };
    }
    return { bg: palette.label, text: "#fff", label: "N/A" };
  }

  function PaginationNav() {
    if (meta.pages <= 1) return null;

    return (
      <nav className="mt-4">
        <ul
          className="pagination justify-content-center"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(1)}
              disabled={page === 1}
              style={{
                background: page === 1 ? palette.border : palette.cardBg,
                color: palette.text,
                border: `1px solid ${palette.border}`,
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              &laquo;
            </button>
          </li>
          {[...Array(meta.pages).keys()].map((i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage(i + 1)}
                style={{
                  background: page === i + 1 ? palette.red : palette.cardBg,
                  color: page === i + 1 ? "#fff" : palette.text,
                  border: `1px solid ${
                    page === i + 1 ? palette.red : palette.border
                  }`,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: page === i + 1 ? "bold" : "normal",
                }}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === meta.pages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(meta.pages)}
              disabled={page === meta.pages}
              style={{
                background:
                  page === meta.pages ? palette.border : palette.cardBg,
                color: palette.text,
                border: `1px solid ${palette.border}`,
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: page === meta.pages ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.text,
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div className="container">
        {/* Header Section */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-5 gap-3">
          <h1
            className="fw-bold mb-0"
            style={{
              fontSize: "2rem",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <i
              className="bi bi-clipboard-list"
              style={{
                color: palette.red,
                fontSize: "1.8rem",
              }}
            />
            My Campaigns
          </h1>
          {filtered.length > 0 && (
            <span
              style={{
                background: palette.red,
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "8px 16px",
                borderRadius: "20px",
                whiteSpace: "nowrap",
              }}
            >
              {filtered.length} Campaign{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Search & Filter */}
        <div
          className="row g-3 mb-5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              style={{
                width: "100%",
                background: palette.cardBg,
                color: palette.text,
                border: `2px solid ${palette.border}`,
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = palette.red;
                e.target.style.boxShadow = `0 0 0 3px ${palette.red}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = palette.border;
                e.target.style.boxShadow = "none";
              }}
              placeholder="Search by title, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <select
              style={{
                width: "100%",
                background: palette.cardBg,
                color: palette.text,
                border: `2px solid ${palette.border}`,
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                border: `4px solid ${palette.border}`,
                borderTop: `4px solid ${palette.red}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}
            />
            <p style={{ color: palette.label }}>Loading campaigns...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              background: isDark ? "#3d1f1f" : "#f8d7da",
              color: isDark ? "#f5a5a5" : "#721c24",
              border: `2px solid ${isDark ? "#5a2c2c" : "#f5c6cb"}`,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              background: isDark ? "#242b3d" : "#f2f6fd",
              border: `2px solid ${palette.border}`,
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
              color: palette.label,
            }}
          >
            <i
              className="bi bi-inbox"
              style={{
                fontSize: "3rem",
                color: palette.red,
                display: "block",
                marginBottom: "16px",
              }}
            ></i>
            <h5 style={{ color: palette.text, fontWeight: "bold" }}>
              No campaigns found
            </h5>
            <p>Try adjusting your filters or create a new campaign.</p>
          </div>
        )}

        {/* Campaigns Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {filtered.map((c) => {
            const cleanDescription = stripHtml(c.description || "").trim();
            const statusInfo = statusClass(c.completion_status, c.status);

            return (
              <div
                key={c._id}
                style={{
                  background: palette.cardBg,
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "0 2px 8px rgba(0,0,0,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  border: `1px solid ${palette.border}`,
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = isDark
                    ? `0 8px 20px rgba(0,0,0,0.4), 0 0 0 3px ${palette.red}20`
                    : `0 8px 20px rgba(0,0,0,0.15), 0 0 0 3px ${palette.red}20`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 2px 8px rgba(0,0,0,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ padding: "20px" }}>
                  {/* Title & Status */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: palette.text,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {truncateText(c.title || "Untitled", 50)}
                    </h5>
                    <span
                      style={{
                        background: statusInfo.bg,
                        color: statusInfo.text,
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatStatus(c.completion_status, c.status)}
                    </span>
                  </div>

                  {/* Category & Review Type */}
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: palette.label,
                      margin: "0 0 12px 0",
                    }}
                  >
                    {c.category || "Uncategorized"}
                    {c.review_type && ` • ${c.review_type} review`}
                  </p>

                  {/* Description */}
                  {cleanDescription ? (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: palette.label,
                        margin: "0 0 16px 0",
                        flex: 1,
                        lineHeight: "1.5",
                      }}
                    >
                      {truncateText(cleanDescription, 120)}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: palette.label,
                        fontStyle: "italic",
                        margin: "0 0 16px 0",
                      }}
                    >
                      No description provided.
                    </p>
                  )}

                  {/* Stats */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "16px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <small style={{ color: palette.label }}>
                      <i
                        className="bi bi-people me-1"
                        style={{ color: palette.red }}
                      ></i>
                      <strong style={{ color: palette.text }}>
                        {c.slots?.used ?? 0}
                      </strong>
                      <span> / {c.slots?.max ?? "∞"}</span>
                    </small>
                    <small style={{ color: palette.label }}>
                      <i
                        className="bi bi-cash-coin me-1"
                        style={{ color: palette.red }}
                      ></i>
                      <strong style={{ color: palette.text }}>
                        {c.reward?.amount_per_worker ?? c.reward?.amount ?? 0}
                      </strong>
                      <span> {c.reward?.currency || ""} / worker</span>
                    </small>
                  </div>

                  {/* Task Link */}
                  {c.task_site && (
                    <div style={{ marginBottom: "16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          background: palette.secondary,
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-link-45deg me-1"></i>
                        {truncateText(c.task_site, 30)}
                      </span>
                    </div>
                  )}

                  {/* View Button */}
                  <Link
                    to={`/viewcampaign/${c._id}`}
                    style={{
                      display: "block",
                      background: palette.red,
                      color: "#fff",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontWeight: "600",
                      textAlign: "center",
                      transition: "all 0.2s",
                      boxShadow: `0 4px 12px ${palette.red}40`,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 6px 16px ${palette.red}60`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = `0 4px 12px ${palette.red}40`;
                    }}
                  >
                    <i className="bi bi-eye me-2"></i>
                    View Campaign
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <PaginationNav />
      </div>
    </div>
  );
}
