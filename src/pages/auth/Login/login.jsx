import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { advertiserLogin, advertiserOauthLogin, advertiserProfile } from "../../services/services";
import { useAdvertiserData } from "../../hooks/useAppDataContext";
import { useLoading } from "../../../context/LoadingContext";
import { useTheme } from "../../../context/ThemeContext";
import { signInWithGoogle } from "../../../config/firebase";

const Login = () => {
  const { setUserLoggedIn } = useAdvertiserData();
  const { showLoading, hideLoading } = useLoading();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const idRef = useRef(null);

  useEffect(() => {
    idRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkProfileAndRedirect = async () => {
    try {
      const profileRes = await advertiserProfile();
      const accountStatus = profileRes.data?.data?.account_status;
      
      if (accountStatus === "INCOMPLETE") {
        window.location.href = "/onboarding";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      // If profile check fails, redirect to dashboard by default
      window.location.href = "/";
    }
  };

  const handleGoogleSignIn = async () => {
    showLoading();
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      
      const res = await advertiserOauthLogin(idToken);
      
      if (res.status === 200 && res.data.data?.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("isAuth", "true");
        setUserLoggedIn(true);
        setTimeout(() => checkProfileAndRedirect(), 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed");
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoading();
    setLoginError("");
    try {
      const res = await advertiserLogin(formData);
      if (res.status === 200 && res.data.data?.token) {
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("isAuth", "true");
        setUserLoggedIn(true);
        
        setTimeout(() => checkProfileAndRedirect(), 1200);
      } else {
        const msg = res.data?.message || "Invalid credentials";
        setLoginError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        padding: window.innerWidth < 768 ? "20px 15px" : "0 20px",
      }}
      style={{
        background: isDark ? "#1a1a1a" : "#f8f9fa",
        fontFamily: "Poppins, system-ui, sans-serif",
      }}
    >
      <ToastContainer position="top-right" theme="light" autoClose={2400} />
      
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 btn btn-outline-secondary rounded-pill px-4 py-2"
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back to Home
      </Link>

      <div
        className="rounded-4 shadow p-5 w-100"
        style={{
          maxWidth: "500px",
          width: "100%",
          background: isDark ? "#2d2d2d" : "#ffffff",
          border: `1px solid ${isDark ? "#404040" : "#e9ecef"}`
        }}
      >
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#e53e3e' }}></i>
          </div>
          <h2 className="fw-bold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>
            Welcome Back
          </h2>
          <p style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>Sign in to your DailyHustle account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>
              Email or Username
            </label>
            <input
              type="text"
              ref={idRef}
              name="identifier"
              className="form-control form-control-lg py-3"
              placeholder="Enter your email or username"
              value={formData.identifier}
              onChange={handleChange}
              required
              autoComplete="username"
              disabled={loading}
              style={{
                border: `2px solid ${isDark ? "#404040" : "#e9ecef"}`,
                borderRadius: "12px",
                fontSize: "1rem",
                background: isDark ? "#1a1a1a" : "#ffffff",
                color: isDark ? "#ffffff" : "#2c3e50"
              }}
            />
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control form-control-lg py-3 pe-5"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              disabled={loading}
              style={{
                border: `2px solid ${isDark ? "#404040" : "#e9ecef"}`,
                borderRadius: "12px",
                fontSize: "1rem",
                background: isDark ? "#1a1a1a" : "#ffffff",
                color: isDark ? "#ffffff" : "#2c3e50"
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
              onClick={() => setShowPassword((v) => !v)}
              style={{ fontSize: "1.2rem", marginTop: "12px" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          {loginError && (
            <div className="alert alert-danger py-2 mb-3 text-center" style={{ border: 'none', borderRadius: '12px' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-lg w-100 py-3 fw-bold text-white mb-4"
            disabled={loading}
            style={{
              background: "#e53e3e",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem"
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center mb-3">
            <div className="d-flex align-items-center mb-3">
              <hr className="flex-grow-1" style={{ borderColor: isDark ? '#404040' : '#e9ecef' }} />
              <span className="px-3" style={{ color: isDark ? '#b0b3c0' : '#6c757d', fontSize: '0.9rem' }}>or continue with</span>
              <hr className="flex-grow-1" style={{ borderColor: isDark ? '#404040' : '#e9ecef' }} />
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn flex-fill py-3 fw-semibold d-flex align-items-center justify-content-center"
                style={{
                  background: isDark ? "#2d2d2d" : "#ffffff",
                  border: `2px solid ${isDark ? "#404040" : "#e9ecef"}`,
                  borderRadius: "12px",
                  color: isDark ? "#ffffff" : "#2c3e50"
                }}
              >
                <i className="bi bi-google me-2" style={{ color: '#DB4437' }}></i>
                Google
              </button>
              <button
                type="button"
                disabled
                className="btn flex-fill py-3 fw-semibold d-flex align-items-center justify-content-center"
                style={{
                  background: isDark ? "#1a1a1a" : "#f8f9fa",
                  border: `2px solid ${isDark ? "#2d2d2d" : "#dee2e6"}`,
                  borderRadius: "12px",
                  color: isDark ? "#666" : "#adb5bd",
                  cursor: "not-allowed"
                }}
              >
                <i className="bi bi-facebook me-2" style={{ color: '#1877F2' }}></i>
                Facebook
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-0" style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-decoration-none fw-semibold"
                style={{ color: "#e53e3e" }}
              >
                Create one here
              </Link>
            </p>
            <div className="mt-2">
              <Link
                to="/forgotpassword"
                className="text-decoration-none"
                style={{ color: isDark ? '#b0b3c0' : '#6c757d', fontSize: "0.9rem" }}
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;