import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import {
  advertiserRegister,
  advertiserValidateRegistrationToken,
  advertiserLogin,
} from "../../services/services";
import api from "../../services/api";
import { useAdvertiserData } from "../../hooks/useAppDataContext";
import { useLoading } from "../../../context/LoadingContext";
import { useTheme } from "../../../context/ThemeContext";
import Onboarding from "../Onboarding/onboarding";

const getPasswordStrength = (pw) => {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  return Math.min(score, 5);
};
const strengthLabels = ["Too Short", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["#dc3545", "#ffc107", "#17a2b8", "#28a745", "#198754"];

export default function QuickSignup() {
  const { setUserLoggedIn } = useAdvertiserData();
  const { showLoading, hideLoading } = useLoading();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  useEffect(() => {
    if (step === 1 && otpRefs.current[0].current) {
      otpRefs.current[0].current.focus();
    }
  }, [step]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (passwordStrength < 3) {
      toast.error("Please choose a stronger password.");
      return;
    }
    setLoading(true);
    showLoading();
    try {
      await advertiserRegister(formData);
      toast.success("Registration successful! OTP sent to your email.");
      setTimeout(() => setStep(1), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].current?.focus();
  };

  const handleOtpPaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
    }
  };
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1].current?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    showLoading();
    try {
      const res = await advertiserValidateRegistrationToken({
        email: formData.email,
        verification_code: otpCode,
      });
      toast.success("Account verified! Welcome aboard! 🎉");
      setOtpVerified(true);
      
      // Store token from OTP verification
      if (res.data.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("isAuth", "true");
      }
      
      setTimeout(() => setShowOnboarding(true), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0].current?.focus();
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const handleOnboardingComplete = async (onboardingData) => {
    showLoading();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/auths/advertisers/onboarding", onboardingData);
      
      if (response.status === 200) {
        toast.success("Welcome to DailyHustle!");
        setUserLoggedIn(true);
        setTimeout(() => (window.location.href = "/"), 1200);
      } else {
        toast.error(response.data?.message || "Onboarding failed");
      }

    } catch (err) {
      toast.error("Failed to complete onboarding");
    } finally {
      hideLoading();
    }
  };

  if (showOnboarding) {
    return <Onboarding userEmail={formData.email} onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <ToastContainer position="top-right" theme="light" autoClose={3000} />
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-3"
        style={{ 
          background: isDark ? "#1a1a1a" : "#f8f9fa",
          padding: window.innerWidth < 768 ? "20px 15px" : "0 20px"
        }}
      >
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
            maxWidth: "550px",
            width: "100%",
            background: isDark ? "#2d2d2d" : "#ffffff",
            border: `1px solid ${isDark ? "#404040" : "#e9ecef"}`
          }}
        >
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-person-plus-fill" style={{ fontSize: '3rem', color: '#e53e3e' }}></i>
            </div>
            <h2 className="fw-bold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>
              {step === 0 ? "Create Your Account" : "Verify Your Email"}
            </h2>
            <p className="mb-3" style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>
              {step === 0 ? "Join thousands of advertisers on DailyHustle" : "Enter the code sent to your email"}
            </p>
            <div className="progress mb-3" style={{ height: '6px', background: '#e9ecef' }}>
              <div className="progress-bar" style={{ 
                width: step === 0 ? '50%' : '100%',
                background: '#e53e3e'
              }}></div>
            </div>
          </div>

          {step === 0 && (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg py-3"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={loading}
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "12px",
                    fontSize: "1rem"
                  }}
                />
              </div>
              
              <div className="mb-4 position-relative">
                <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Create Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg py-3 pe-5"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                  style={{
                    border: "2px solid #e9ecef",
                    borderRadius: "12px",
                    fontSize: "1rem"
                  }}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3 text-muted"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                  style={{ fontSize: "1.2rem", marginTop: "12px" }}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                <div className="mt-2">
                  <div className="progress" style={{ height: "6px", background: "#e9ecef" }}>
                    <div
                      className="progress-bar"
                      style={{
                        background: strengthColors[passwordStrength],
                        width: `${(passwordStrength / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div
                    className="small mt-1 mb-0 text-end fw-semibold"
                    style={{ color: strengthColors[passwordStrength] }}
                  >
                    {strengthLabels[passwordStrength]}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-lg w-100 py-3 fw-bold text-white mb-4"
                disabled={loading || passwordStrength < 3}
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center">
                <p className="mb-0" style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: "#e53e3e" }}>
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          )}
          
          {step === 1 && (
            <div>
              <p className="text-center mb-4" style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>
                Enter the 6-digit verification code sent to:<br/>
                <strong style={{ color: '#e53e3e' }}>{formData.email}</strong>
              </p>
              <div className="d-flex justify-content-center gap-3 mb-5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs.current[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    onPaste={(e) => handleOtpPaste(e, idx)}
                    className="form-control text-center fw-bold"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "1.5rem",
                      borderRadius: "12px",
                      border: "2px solid #e9ecef"
                    }}
                    disabled={loading}
                  />
                ))}
              </div>
              <button
                className="btn btn-lg w-100 py-3 fw-bold text-white"
                onClick={handleVerifyOtp}
                disabled={loading || otp.join("").length !== 6}
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
                    Verifying Code...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
              {otpVerified && (
                <div className="alert alert-success mt-4 text-center" style={{ border: 'none', borderRadius: '12px' }}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Email verified successfully!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}