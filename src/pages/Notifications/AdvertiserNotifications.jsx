// import React from "react";
// import { useAdvertiserData } from "../hooks/useAppDataContext";

export default function AdvertiserNotifications() {
  // If you add notifications to context (suggested), pull them like this:
  // const { notifications = [] } = useAdvertiserData();

  return (
    <div className="container py-4">
      {/* <h2 className="fw-bold mb-4">
        <i className="bi bi-bell text-warning me-2" />
        Notifications
      </h2>
      <div>
        {notifications.length === 0 ? (
          <div className="alert alert-info">
            No notifications yet. You’ll see campaign, wallet, and submissions
            alerts here.
          </div>
        ) : (
          <ul className="list-group rounded-3 shadow-sm">
            {notifications.map((n, idx) => (
              <li
                key={idx}
                className={`list-group-item d-flex align-items-center gap-3${
                  n.read ? "" : " fw-bold bg-light"
                }`}
              >
                <i
                  className={`bi ${
                    n.type === "success"
                      ? "bi-check-circle-fill text-success"
                      : n.type === "warning"
                      ? "bi-exclamation-circle-fill text-warning"
                      : n.type === "error"
                      ? "bi-x-circle-fill text-danger"
                      : "bi-info-circle text-info"
                  } fs-5`}
                />
                <div>
                  <div>{n.message}</div>
                  {n.date && (
                    <div className="small text-muted mt-1">
                      {new Date(n.date).toLocaleString()}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}
