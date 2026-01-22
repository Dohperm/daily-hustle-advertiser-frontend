import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BarChart2,
  Wallet,
  Users,
  PlusCircle,
  Megaphone,
  ArrowRightCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAdvertiserData } from "../hooks/useAppDataContext";
import {
  advertiserListMyTasks,
  advertiserTaskStats,
  advertiserWalletBalance,
} from "../services/services";

/* ---- MOCKS FOR GUESTS ---- */
const MOCK_STATS = { active_tasks: 0, completed_tasks: 0 };
const MOCK_CAMPAIGNS = [];
const MOCK_WALLET = { balance: 0 };

/* ---- MAIN DASHBOARD COMPONENT ---- */
export default function AdvertiserDashboard() {
  const { theme } = useTheme();
  const { wallet, userAppData } = useAdvertiserData();
  const isDark = theme === "dark";

  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      red: "#e53e3e",
      success: "#28a745",
      warning: "#ffc107",
      info: "#0dcaf0",
      primary: "#0d6efd",
    }),
    [isDark]
  );

  const [stats, setStats] = useState(MOCK_STATS);
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Show mock data until user logs in and real data loads
  useEffect(() => {
    async function fetchDashboard() {
      const token = localStorage.getItem('token');

      
      if (!token) {
        // Show mock demo data and don't fetch
        setStats(MOCK_STATS);
        setCampaigns(MOCK_CAMPAIGNS);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fetch stats
        const statsRes = await advertiserTaskStats();
        setStats(
          statsRes?.data?.data || { active_tasks: 0, completed_tasks: 0 }
        );

        // Fetch all tasks
        const tasksRes = await advertiserListMyTasks(1);
        const rawData = tasksRes?.data?.data || {};
        const allTasks = Array.isArray(rawData.data) ? rawData.data : [];
        setCampaigns(allTasks);

        // Fetch wallet balance
        const walletRes = await advertiserWalletBalance();
        const balance = walletRes?.data?.data?.balance || 0;
        setWalletBalance(balance);
      } catch (err) {
        setStats({ active_tasks: 0, completed_tasks: 0 });
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // Get first 3 campaigns sorted by date (newest first)
  const latestCampaigns = campaigns
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);

  // Recent activity from first 3 campaigns
  const recentActivity = latestCampaigns.map((c) => ({
    id: c._id,
    title: c.title || "Untitled Campaign",
    message: `Campaign "${c.title || "Untitled"}" is ${
      c.completion_status
        ? c.completion_status.toLowerCase()
        : c.status
        ? "active"
        : "inactive"
    }`,
    time: c.date ? new Date(c.date).toLocaleString() : "N/A",
    status: c.completion_status || (c.status ? "Active" : "Inactive"),
    type:
      c.completion_status?.toLowerCase() === "completed"
        ? "secondary"
        : c.completion_status?.toLowerCase() === "active" || c.status
        ? "success"
        : "warning",
  }));

  // Use API wallet balance if token exists, otherwise mock
  const hasToken = localStorage.getItem('token');
  const currentBalance = hasToken ? walletBalance : 0;

  // Stats cards use live or demo data
  const statCards = [
    {
      label: "Active Campaigns",
      value: stats.active_tasks ?? 0,
      icon: Megaphone,
      color: palette.primary,
    },
    {
      label: "Completed Campaigns",
      value: stats.completed_tasks ?? 0,
      icon: BarChart2,
      color: palette.success,
    },
    {
      label: "Total Campaigns",
      value: campaigns.length,
      icon: Users,
      color: palette.info,
    },
    {
      label: "Wallet Balance",
      value: `₦${currentBalance.toLocaleString()}`,
      icon: Wallet,
      color: palette.red,
    },
  ];

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.text,
        minHeight: "100vh",
        padding: window.innerWidth < 768 ? "20px 15px" : "40px 20px",
      }}
    >
      {/* Container */}
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            gap: "16px",
          }}
        >
          <h1
            className="fw-bold mb-0"
            style={{
              fontSize: window.innerWidth < 768 ? "1.5rem" : "2rem",
              color: palette.text,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <i
              className="bi bi-speedometer2"
              style={{ color: palette.red, fontSize: "1.8rem" }}
            ></i>
            Employer Dashboard
          </h1>
          <Button
            as={Link}
            to="/jobs/new"
            className="shadow-sm"
            style={{
              background: palette.red,
              border: "none",
              padding: "10px 20px",
              fontWeight: "600",
              borderRadius: "50px", // More rounded for modern feel
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.95rem"
            }}
          >
            <PlusCircle size={18} />
            New Campaign
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Spinner
              animation="border"
              style={{ color: palette.red, marginBottom: "20px" }}
            />
            <p style={{ color: palette.label }}>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <Row className="g-4 mb-4">
              {statCards.map((stat, idx) => (
                <Col xs={12} sm={6} lg={3} key={idx}>
                  <div
                    className="stat-card-hover"
                    style={{
                      background: palette.cardBg,
                      borderRadius: "16px",
                      padding: "20px",
                      border: `1px solid ${palette.border}`,
                      boxShadow: isDark
                        ? "0 4px 20px rgba(0,0,0,0.2)"
                        : "0 4px 20px rgba(0,0,0,0.05)",
                      textAlign: "center",
                      transition: "all 0.25s ease",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <stat.icon
                      size={36}
                      style={{
                        color: stat.color,
                        marginBottom: "12px",
                      }}
                    />
                    <h3
                      style={{
                        fontWeight: "bold",
                        color: stat.color,
                        fontSize: "1.8rem",
                        margin: "12px 0 8px 0",
                      }}
                    >
                      {stat.value}
                    </h3>
                    <p
                      style={{
                        color: palette.label,
                        fontSize: "0.9rem",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Latest Campaigns & Recent Activity */}
            <Row className="g-4">
              {/* Latest Campaigns */}
              <Col lg={7} md={12} xs={12} className="mb-4 mb-lg-0">
                <div
                  style={{
                    background: palette.cardBg,
                    borderRadius: "14px",
                    border: `1px solid ${palette.border}`,
                    boxShadow: isDark
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "24px",
                      borderBottom: `1px solid ${palette.border}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <h5
                      style={{
                        fontWeight: "bold",
                        color: palette.text,
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Megaphone size={20} style={{ color: palette.red }} />
                      Latest Campaigns
                    </h5>
                    <Button
                      as={Link}
                      to="/jobs/my-campaigns"
                      style={{
                        background: "transparent",
                        color: palette.red,
                        border: `1px solid ${palette.red}`,
                        padding: "6px 12px",
                        fontWeight: "600",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      View All <ArrowRightCircle size={14} />
                    </Button>
                  </div>
                  {/* Content */}
                  <div style={{ padding: "20px" }}>
                    {latestCampaigns.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: palette.label,
                        }}
                      >
                        <i
                          className="bi bi-inbox"
                          style={{
                            fontSize: "2rem",
                            display: "block",
                            marginBottom: "12px",
                          }}
                        ></i>
                        No campaigns yet.
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {latestCampaigns.map((c) => (
                          <div
                            key={c._id}
                            style={{
                              background: palette.bg,
                              padding: "16px",
                              borderRadius: "12px",
                              border: `1px solid ${palette.border}`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "12px",
                              transition: "all 0.2s",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = palette.red;
                              e.currentTarget.style.background = isDark
                                ? "#242b3d"
                                : "#f2f6fd";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor =
                                palette.border;
                              e.currentTarget.style.background = palette.bg;
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <Link
                                to={`/viewcampaign/${c._id}`}
                                style={{
                                  fontWeight: "bold",
                                  color: palette.text,
                                  textDecoration: "none",
                                  fontSize: "0.95rem",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.color = palette.red;
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.color = palette.text;
                                }}
                              >
                                {c.title || "Untitled"}
                              </Link>
                              <div
                                style={{
                                  marginTop: "6px",
                                  display: "inline-block",
                                }}
                              >
                                <span
                                  style={{
                                    background:
                                      c.completion_status?.toLowerCase() ===
                                      "completed"
                                        ? "#6c757d"
                                        : c.completion_status?.toLowerCase() ===
                                            "active" || c.status
                                        ? palette.success
                                        : palette.warning,
                                    color:
                                      c.completion_status?.toLowerCase() ===
                                        "completed" ||
                                      c.completion_status?.toLowerCase() ===
                                        "active" ||
                                      c.status
                                        ? "#fff"
                                        : "#000",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                  }}
                                >
                                  {c.completion_status
                                    ? c.completion_status
                                        .charAt(0)
                                        .toUpperCase() +
                                      c.completion_status.slice(1)
                                    : c.status
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>
                            </div>
                            <div
                              style={{
                                color: palette.label,
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              ₦
                              {(
                                c.reward?.amount_per_worker ??
                                c.reward?.amount ??
                                0
                              ).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              {/* Recent Activity */}
              <Col lg={5} md={12}>
                <div
                  style={{
                    background: palette.cardBg,
                    borderRadius: "14px",
                    border: `1px solid ${palette.border}`,
                    boxShadow: isDark
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "24px",
                      borderBottom: `1px solid ${palette.border}`,
                    }}
                  >
                    <h5
                      style={{
                        fontWeight: "bold",
                        color: palette.text,
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BarChart2 size={20} style={{ color: palette.red }} />
                      Recent Activity
                    </h5>
                  </div>
                  {/* Content */}
                  <div style={{ padding: "20px" }}>
                    {recentActivity.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: palette.label,
                        }}
                      >
                        <i
                          className="bi bi-activity"
                          style={{
                            fontSize: "2rem",
                            display: "block",
                            marginBottom: "12px",
                          }}
                        ></i>
                        No recent activity.
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        {recentActivity.map((a) => (
                          <div
                            key={a.id}
                            style={{
                              padding: "16px",
                              background: palette.bg,
                              borderRadius: "10px",
                              borderLeft: `4px solid ${palette.red}`,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "600",
                                color: palette.text,
                                marginBottom: "8px",
                                fontSize: "0.95rem",
                              }}
                            >
                              {a.title}
                            </div>
                            <small
                              style={{
                                color: palette.label,
                                display: "block",
                                marginBottom: "6px",
                              }}
                            >
                              {a.message}
                            </small>
                            <small
                              style={{
                                color: palette.label,
                                fontSize: "0.85rem",
                              }}
                            >
                              {a.time}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
}
