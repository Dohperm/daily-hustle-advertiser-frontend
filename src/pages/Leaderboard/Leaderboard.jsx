// import React from "react";
// import { useAdvertiserData } from "../hooks/useAppDataContext";

export default function Leaderboard() {
  // const { campaigns } = useAdvertiserData();

  // // Example sort: top campaigns by completedjobs, descending
  // const topCampaigns = [...campaigns]
  //   .sort((a, b) => (b.completedjobs || 0) - (a.completedjobs || 0))
    // .slice(0, 5);

  return (
    <div className="container py-4">
      {/* <h2 className="fw-bold mb-4">
        <i className="bi bi-trophy text-warning me-2" />
        Leaderboard
      </h2>
      <div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Campaign</th>
                <th className="d-none d-md-table-cell">Category</th>
                <th>Completed jobs</th>
                <th>Status</th>
                <th className="d-none d-md-table-cell">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCampaigns.length ? (
                topCampaigns.map((c, idx) => (
                  <tr key={c.id}>
                    <td>
                      <span className="badge bg-warning text-dark fs-6">
                        {idx + 1}
                      </span>
                    </td>
                    <td>
                      <span className="fw-semibold">{c.title}</span>
                    </td>
                    <td className="d-none d-md-table-cell">{c.category}</td>
                    <td>
                      <span className="fw-bold">{c.completedjobs}</span>
                      <span className="text-muted ms-2">/ {c.totaljobs}</span>
                    </td>
                    <td>
                      <span
                        className={
                          "badge px-2 " +
                          (c.status === "active"
                            ? "bg-success"
                            : c.status === "completed"
                            ? "bg-primary"
                            : "bg-secondary")
                        }
                      >
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      ₦{c.spent?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <span className="text-muted">No campaigns available.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="alert alert-info mt-4">
          Ranked by campaign performance (jobs completed). Success badges and
          worker/engagement data can be added here.
        </div>
      </div> */}
    </div>
  );
}
