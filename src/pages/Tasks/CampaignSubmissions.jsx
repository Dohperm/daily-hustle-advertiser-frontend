import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { advertiserListSubmissions, advertiserUpdateTaskProofStatus } from "../services/services";
import { useTheme } from "../../context/ThemeContext";

export default function CampaignSubmissions() {
  const { taskId } = useParams();
  const navigate = useNavigate();
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

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError("");
      try {
        const res = await advertiserListSubmissions(taskId);
        const data = res.data?.data?.data || [];
        setSubmissions(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    }
    if (taskId) fetchSubmissions();
  }, [taskId]);

  const handleApproval = async (submissionId, status) => {
    try {
      console.log('Updating submission:', submissionId, 'to status:', status);
      const response = await advertiserUpdateTaskProofStatus(submissionId, { approval_status: status });
      console.log('API response:', response);
      
      setSubmissions(prev =>
        prev.map(sub =>
          sub._id === submissionId
            ? { ...sub, approval_status: status, is_approved: status === "approved" }
            : sub
        )
      );
      console.log('Local state updated successfully');
    } catch (err) {
      console.error("Failed to update submission:", err);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = search === "" || sub._id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return { bg: palette.success, text: "#fff" };
      case "rejected": return { bg: palette.red, text: "#fff" };
      default: return { bg: palette.warning, text: "#000" };
    }
  };

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
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: `2px solid ${palette.border}`,
              color: palette.text,
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "16px",
            }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h1 className="fw-bold mb-0">Campaign Submissions</h1>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: palette.cardBg,
                color: palette.text,
                border: `2px solid ${palette.border}`,
                borderRadius: "8px",
                padding: "12px 16px",
              }}
            />
          </div>
          <div className="col-md-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: "100%",
                background: palette.cardBg,
                color: palette.text,
                border: `2px solid ${palette.border}`,
                borderRadius: "8px",
                padding: "12px 16px",
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px" }}>
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
            <p>Loading submissions...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: isDark ? "#3d1f1f" : "#f8d7da",
              color: isDark ? "#f5a5a5" : "#721c24",
              border: `2px solid ${isDark ? "#5a2c2c" : "#f5c6cb"}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Submissions Table */}
        {!loading && !error && (
          <div
            style={{
              background: palette.cardBg,
              borderRadius: "12px",
              overflow: "hidden",
              border: `1px solid ${palette.border}`,
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: isDark ? "#2a2a2a" : "#f8f9fa" }}>
                    <th style={{ padding: "16px", textAlign: "left", color: palette.text, fontWeight: "600" }}>
                      Proof
                    </th>
                    <th style={{ padding: "16px", textAlign: "left", color: palette.text, fontWeight: "600" }}>
                      Status
                    </th>
                    <th style={{ padding: "16px", textAlign: "center", color: palette.text, fontWeight: "600" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => {
                    const statusInfo = getStatusColor(submission.approval_status);
                    return (
                      <tr
                        key={submission._id}
                        style={{
                          borderBottom: `1px solid ${palette.border}`,
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = isDark ? "#2a2a2a" : "#f8f9fa";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ padding: "16px" }}>
                          {submission.src ? (
                            <img
                              src={submission.src}
                              alt="Proof"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                cursor: "pointer",
                              }}
                              onClick={() => window.open(submission.src, "_blank")}
                            />
                          ) : (
                            <span style={{ color: palette.label, fontStyle: "italic" }}>
                              No image
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              background: statusInfo.bg,
                              color: statusInfo.text,
                              padding: "4px 12px",
                              borderRadius: "16px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              textTransform: "capitalize",
                            }}
                          >
                            {submission.approval_status}
                          </span>
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          {submission.approval_status === "pending" && (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button
                                onClick={() => handleApproval(submission._id, "approved")}
                                style={{
                                  background: palette.success,
                                  color: "#fff",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <i className="bi bi-check-lg me-1"></i>
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproval(submission._id, "rejected")}
                                style={{
                                  background: palette.red,
                                  color: "#fff",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                <i className="bi bi-x-lg me-1"></i>
                                Reject
                              </button>
                            </div>
                          )}
                          {submission.approval_status !== "pending" && (
                            <span style={{ color: palette.label, fontSize: "0.85rem" }}>
                              Already {submission.approval_status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredSubmissions.length === 0 && (
              <div style={{ padding: "60px", textAlign: "center", color: palette.label }}>
                <i className="bi bi-inbox" style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}></i>
                <h5>No submissions found</h5>
                <p>No submissions match your current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}