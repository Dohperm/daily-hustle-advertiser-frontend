import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../../public/dailyjhustleimage.png";
export default function Sidebar() {
  const [jobsOpen, setjobsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="logo mb-4 d-flex justify-content-center align-items-center gap-2">
        <img src={Logo} alt="logo" height={80} />
        <strong>DailyHustle</strong>
      </div>
      <nav className="flex-grow-1">
        <ul className="nav flex-column gap-1">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              <i className="bi bi-house-door-fill me-2" />
              Dashboard
            </NavLink>
          </li>
          {/* jobs Dropdown */}
          <li className="nav-item">
            <button
              className="nav-link d-flex align-items-center w-100"
              onClick={() => setjobsOpen((open) => !open)}
              aria-expanded={jobsOpen}
              type="button"
              tabIndex={0}
              style={{ background: "none", border: "none", outline: "none" }}
            >
              <i className="bi bi-briefcase-fill me-2" />
              Jobs
              <i
                className={`bi ms-auto ${
                  jobsOpen ? "bi-chevron-up" : "bi-chevron-down"
                }`}
              />
            </button>
            {jobsOpen && (
              <ul className="nav flex-column ms-3">
                <li>
                  <NavLink to="/jobs/allcampaigns" className="nav-link">
                    <i className="bi bi-bullseye me-2" />
                    All Campaigns
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/jobs/my-campaigns" className="nav-link">
                    <i className="bi bi-list-jobs me-2" />
                    My Campaigns
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/jobs/new" className="nav-link">
                    <i className="bi bi-plus-circle me-2" />
                    New jobs
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/jobs/submissions" className="nav-link">
                    <i className="bi bi-check2-square me-2" />
                    Review Submissions
                  </NavLink>
                </li> */}
              </ul>
            )}
          </li>
          <li className="nav-item">
            <NavLink to="/wallet" className="nav-link">
              <i className="bi bi-wallet2 me-2" />
              Wallet
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/leaderboard" className="nav-link">
              <i className="bi bi-trophy me-2" />
              Leaderboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/plans" className="nav-link">
              <i className="bi bi-gem me-2" />
              Plans
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/training" className="nav-link">
              <i className="bi bi-journal-text me-2" />
              Training
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/notifications" className="nav-link">
              <i className="bi bi-bell me-2" />
              Notifications
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/settings" className="nav-link">
              <i className="bi bi-gear me-2" />
              Settings
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/support" className="nav-link">
              <i className="bi bi-headset me-2" />
              Support
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-4">
        <small>DailyHustle • Advertiser</small>
      </div>
    </aside>
  );
}
