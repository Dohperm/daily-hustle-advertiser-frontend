import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
export default function AdvertiserSettings() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: "John Advertiser",
    email: "john@brand.com",
    phone: "+2348012345678",
    kyc: true,
    notifications: true,
  });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmChange = (e) => setConfirm(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved!");
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-gear text-muted me-2" />
        Settings
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-4 p-4 shadow-sm mb-4"
      >
        <h5 className="fw-bold mb-3">Profile Information</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Account Name</label>
            <input
              className="form-control"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 d-flex align-items-center gap-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                name="notifications"
                checked={profile.notifications}
                onChange={handleChange}
                id="notifSwitch"
              />
              <label className="form-check-label" htmlFor="notifSwitch">
                Email Notifications
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                name="kyc"
                checked={profile.kyc}
                onChange={handleChange}
                id="kycSwitch"
              />
              <label className="form-check-label" htmlFor="kycSwitch">
                KYC Verified
              </label>
            </div>
            {/* Theme toggle switch */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="themeSwitch"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <label className="form-check-label" htmlFor="themeSwitch">
                Dark Mode
              </label>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <h5 className="fw-bold mb-3">Change Password</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">New Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              value={confirm}
              onChange={handleConfirmChange}
              required
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-custom px-4 fw-bold">
            Save Settings
          </button>
        </div>
      </form>
      <div className="alert alert-secondary">
        Use these settings to manage your advertiser profile, KYC,
        notifications, login credentials, and theme preference.
      </div>
    </div>
  );
}
