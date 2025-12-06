import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { advertiserLogin } from "../../services/services";
import { useAdvertiserData } from "../../hooks/useAppDataContext";
import { useLoading } from "../../../context/LoadingContext";

const Login = () => {
  const { setUserLoggedIn } = useAdvertiserData();
  const { showLoading, hideLoading } = useLoading();
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
        
        setTimeout(() => (window.location.href = "/"), 1200);
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
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{
        background: "#f8f9fa",
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
        className="bg-white rounded-4 shadow p-5 w-100"
        style={{
          maxWidth: "500px",
          border: "1px solid #e9ecef"
        }}
      >
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#ff6b35' }}></i>
          </div>
          <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
            Welcome Back
          </h2>
          <p className="text-muted">Sign in to your DailyHustle account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark mb-2">
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
                border: "2px solid #e9ecef",
                borderRadius: "12px",
                fontSize: "1rem"
              }}
            />
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label fw-semibold text-dark mb-2">
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
                border: "2px solid #e9ecef",
                borderRadius: "12px",
                fontSize: "1rem"
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
              background: "#ff6b35",
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

          <div className="text-center">
            <p className="text-muted mb-0">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-decoration-none fw-semibold"
                style={{ color: "#ff6b35" }}
              >
                Create one here
              </Link>
            </p>
            <div className="mt-2">
              <Link
                to="/forgotpassword"
                className="text-decoration-none"
                style={{ color: "#6c757d", fontSize: "0.9rem" }}
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