import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { 
  Megaphone, 
  Users, 
  Wallet, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      red: "#ed3224",
      success: "#28a745",
      primary: "#0d6efd",
    }),
    [isDark]
  );

  const features = [
    {
      icon: Megaphone,
      title: "Create Campaigns",
      description: "Launch targeted marketing campaigns and reach your audience effectively"
    },
    {
      icon: Users,
      title: "Manage Workers",
      description: "Connect with skilled workers and manage your campaign submissions"
    },
    {
      icon: Wallet,
      title: "Secure Payments",
      description: "Fund your wallet securely and pay workers instantly upon task completion"
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      description: "Monitor campaign progress with detailed analytics and reporting"
    }
  ];

  const benefits = [
    "Easy campaign creation and management",
    "Secure payment processing with Paystack",
    "Real-time campaign tracking",
    "Quality worker verification system",
    "24/7 customer support"
  ];

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.text,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <nav
        style={{
          background: palette.cardBg,
          borderBottom: `1px solid ${palette.border}`,
          padding: "16px 0",
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: palette.red,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Megaphone size={24} color="#fff" />
              </div>
              <div>
                <h4 className="fw-bold mb-0" style={{ color: palette.text }}>
                  DailyHustle
                </h4>
                <small style={{ color: palette.red, fontWeight: "600" }}>for Employers</small>
              </div>
            </div>
            <div className="d-flex gap-3">
              <Link
                to="/login"
                className="btn"
                style={{
                  background: "transparent",
                  color: palette.text,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "8px",
                  padding: "8px 20px",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn"
                style={{
                  background: palette.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  textDecoration: "none",
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "3.5rem",
                  color: palette.text,
                  lineHeight: "1.2",
                }}
              >
                The Ultimate{" "}
                <span style={{ color: palette.red }}>Employer Platform</span>{" "}
                for Campaign Success
              </h1>
              <p
                className="mb-4"
                style={{
                  fontSize: "1.2rem",
                  color: palette.label,
                  lineHeight: "1.6",
                }}
              >
                Designed specifically for employers to create powerful campaigns, connect with quality workers, and scale their marketing efforts with ease.
              </p>
              <div className="d-flex gap-3 mb-5">
                <Link
                  to="/signup"
                  className="btn btn-lg"
                  style={{
                    background: palette.red,
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 32px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Start Free Trial <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-lg"
                  style={{
                    background: "transparent",
                    color: palette.text,
                    border: `2px solid ${palette.border}`,
                    borderRadius: "12px",
                    padding: "12px 32px",
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                style={{
                  background: `linear-gradient(135deg, ${palette.red}20, ${palette.primary}20)`,
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <div className="row g-3">
                  <div className="col-6">
                    <div
                      style={{
                        background: palette.cardBg,
                        borderRadius: "12px",
                        padding: "20px",
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <Megaphone size={32} style={{ color: palette.red, marginBottom: "8px" }} />
                      <h5 style={{ color: palette.text, fontSize: "1rem" }}>Campaigns</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        background: palette.cardBg,
                        borderRadius: "12px",
                        padding: "20px",
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <Users size={32} style={{ color: palette.success, marginBottom: "8px" }} />
                      <h5 style={{ color: palette.text, fontSize: "1rem" }}>Workers</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        background: palette.cardBg,
                        borderRadius: "12px",
                        padding: "20px",
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <Wallet size={32} style={{ color: palette.primary, marginBottom: "8px" }} />
                      <h5 style={{ color: palette.text, fontSize: "1rem" }}>Payments</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      style={{
                        background: palette.cardBg,
                        borderRadius: "12px",
                        padding: "20px",
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <BarChart3 size={32} style={{ color: "#ffc107", marginBottom: "8px" }} />
                      <h5 style={{ color: palette.text, fontSize: "1rem" }}>Analytics</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 0", background: palette.cardBg }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: palette.text, fontSize: "2.5rem" }}>
              Built for Employers, By Employers
            </h2>
            <p style={{ color: palette.label, fontSize: "1.1rem" }}>
              Everything you need to launch, manage, and optimize your employer campaigns
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div
                  style={{
                    background: palette.bg,
                    borderRadius: "16px",
                    padding: "32px 24px",
                    border: `1px solid ${palette.border}`,
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <feature.icon size={48} style={{ color: palette.red, marginBottom: "16px" }} />
                  <h5 className="fw-bold mb-3" style={{ color: palette.text }}>
                    {feature.title}
                  </h5>
                  <p style={{ color: palette.label, lineHeight: "1.6" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: "80px 0", background: palette.cardBg }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <Megaphone size={24} style={{ color: palette.red }} />
              <h2 className="fw-bold mb-0" style={{ color: palette.red, fontSize: "1.5rem" }}>
                Employer Plans
              </h2>
            </div>
            <p style={{ color: palette.label, fontSize: "1.1rem" }}>
              Choose the perfect plan to scale your employer campaigns
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {/* Basic Plan */}
            <div className="col-lg-4 col-md-6">
              <div
                style={{
                  background: palette.bg,
                  borderRadius: "16px",
                  padding: "32px 24px",
                  border: `1px solid ${palette.border}`,
                  textAlign: "center",
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    display: "inline-block",
                    marginBottom: "16px",
                  }}
                >
                  BASIC
                </div>
                <h3 className="fw-bold mb-2" style={{ color: palette.text }}>
                  Starter Test
                </h3>
                <div className="mb-4">
                  <span style={{ color: palette.red, fontSize: "2rem", fontWeight: "bold" }}>
                    ₦0
                  </span>
                  <span style={{ color: palette.label }}>/annum</span>
                </div>
                <div className="text-start mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Up to 2 campaigns/month</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Standard approval queue</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Basic analytics</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Standard HP cap</span>
                  </div>
                </div>
                <p style={{ color: palette.label, fontSize: "0.85rem", fontStyle: "italic" }}>
                  Perfect for testing platform viability
                </p>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="col-lg-4 col-md-6">
              <div
                style={{
                  background: palette.bg,
                  borderRadius: "16px",
                  padding: "32px 24px",
                  border: `2px solid ${palette.red}`,
                  textAlign: "center",
                  height: "100%",
                  position: "relative",
                  transform: "scale(1.05)",
                }}
              >
                <div
                  style={{
                    background: "#ffc107",
                    color: "#000",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    display: "inline-block",
                    marginBottom: "16px",
                  }}
                >
                  ⭐ PRO - Most Popular
                </div>
                <h3 className="fw-bold mb-2" style={{ color: palette.text }}>
                  Growth Engine
                </h3>
                <div className="mb-4">
                  <span style={{ color: palette.red, fontSize: "2rem", fontWeight: "bold" }}>
                    ₦10,000
                  </span>
                  <span style={{ color: palette.label }}>/annum</span>
                </div>
                <div className="text-start mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Unlimited campaigns</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Priority approval</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Premium analytics</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}><strong>5% Ad Credit Bonus</strong></span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Micro-tasks below ₦1,000</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>2,500 HP/month cap</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="col-lg-4 col-md-6">
              <div
                style={{
                  background: palette.bg,
                  borderRadius: "16px",
                  padding: "32px 24px",
                  border: `1px solid ${palette.border}`,
                  textAlign: "center",
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    background: "#6c757d",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    display: "inline-block",
                    marginBottom: "16px",
                  }}
                >
                  🏢 ENTERPRISE
                </div>
                <h3 className="fw-bold mb-2" style={{ color: palette.text }}>
                  Custom Scale
                </h3>
                <div className="mb-4">
                  <span style={{ color: palette.red, fontSize: "2rem", fontWeight: "bold" }}>
                    ₦20,000
                  </span>
                  <span style={{ color: palette.label }}>/annum</span>
                </div>
                <div className="text-start mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Unlimited everything</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}><strong>10% Ad Credit Bonus</strong></span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Dedicated account manager</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Full API access</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Custom integrations</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} style={{ color: palette.success, marginRight: "8px" }} />
                    <span style={{ color: palette.text, fontSize: "0.9rem" }}>Custom HP cap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <div
              style={{
                background: `${palette.red}15`,
                border: `1px solid ${palette.red}30`,
                borderRadius: "12px",
                padding: "20px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <p className="mb-0" style={{ color: palette.text, fontSize: "1rem" }}>
                <strong>Coming Soon:</strong> All subscription plans will be available in the next 30 days. Sign up now to get notified!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4" style={{ color: palette.text, fontSize: "2.5rem" }}>
                Why Choose DailyHustle?
              </h2>
              <div className="mb-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <CheckCircle size={20} style={{ color: palette.success, marginRight: "12px" }} />
                    <span style={{ color: palette.text }}>{benefit}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/signup"
                className="btn btn-lg"
                style={{
                  background: palette.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 32px",
                  textDecoration: "none",
                }}
              >
                Get Started Today
              </Link>
            </div>
            <div className="col-lg-6">
              <div
                style={{
                  background: palette.cardBg,
                  borderRadius: "20px",
                  padding: "40px",
                  border: `1px solid ${palette.border}`,
                }}
              >
                <div className="text-center mb-4">
                  <Shield size={64} style={{ color: palette.red }} />
                  <h4 className="fw-bold mt-3" style={{ color: palette.text }}>
                    Secure & Reliable
                  </h4>
                </div>
                <div className="row g-3">
                  <div className="col-6 text-center">
                    <Zap size={32} style={{ color: palette.primary }} />
                    <p className="mt-2 mb-0" style={{ color: palette.label, fontSize: "0.9rem" }}>
                      Fast Setup
                    </p>
                  </div>
                  <div className="col-6 text-center">
                    <Shield size={32} style={{ color: palette.success }} />
                    <p className="mt-2 mb-0" style={{ color: palette.label, fontSize: "0.9rem" }}>
                      Secure Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 0",
          background: `linear-gradient(135deg, ${palette.red}, #ff6b5b)`,
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ color: "#fff", fontSize: "2.5rem" }}>
            Ready to Launch Your First Campaign?
          </h2>
          <p className="mb-4" style={{ color: "#fff", fontSize: "1.2rem", opacity: 0.9 }}>
            Join thousands of employers who trust DailyHustle for their marketing needs
          </p>
          <Link
            to="/signup"
            className="btn btn-lg"
            style={{
              background: "#fff",
              color: palette.red,
              border: "none",
              borderRadius: "12px",
              padding: "12px 32px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: palette.cardBg,
          borderTop: `1px solid ${palette.border}`,
          padding: "40px 0",
        }}
      >
        <div className="container">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: palette.red,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Megaphone size={20} color="#fff" />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: palette.text }}>
                  DailyHustle
                </h5>
                <small style={{ color: palette.red }}>Employer Platform</small>
              </div>
            </div>
            <p style={{ color: palette.label, margin: 0 }}>
              © 2024 DailyHustle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}