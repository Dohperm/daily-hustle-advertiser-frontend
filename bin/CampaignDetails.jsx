import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAdvertiserData } from "../src/pages/hooks/useAppDataContext";

export default function CampaignDetails() {
  const { id } = useParams();
  const { campaigns, submissions, onEditCampaign, onAddFunds } =
    useAdvertiserData();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="container py-4">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-info-circle me-2 text-info" />
          Campaign Details
        </h2>
        <div className="alert alert-danger">Campaign not found.</div>
      </div>
    );
  }

  const relatedSubmissions = submissions.filter(
    (s) => s.campaignId === campaign.id
  );
  const statusBadge =
    campaign.status === "active"
      ? "bg-success"
      : campaign.status === "completed"
      ? "bg-secondary"
      : "bg-light text-muted";

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-info-circle me-2 text-info" />
        Campaign Details
      </h2>
      <div className="mb-3 text-muted">
        Campaign ID: <span className="fw-medium">{campaign.id}</span>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="bg-white rounded-4 p-4 mb-3 shadow-sm">
            <h4 className="fw-bold">{campaign.title}</h4>
            <div className="mb-3 text-muted">{campaign.category}</div>
            <div className="mb-3">{campaign.description}</div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <span className={`badge ${statusBadge}`}>{campaign.status}</span>
              <span>
                <i className="bi bi-people-fill me-1" /> jobs:{" "}
                {campaign.completedjobs} / {campaign.totaljobs}
              </span>
              <span>
                <i className="bi bi-wallet2 me-1" /> Budget: ₦
                {campaign.budget.toLocaleString()}
              </span>
              <span>
                <i className="bi bi-cash me-1" /> Spent: ₦
                {(campaign.spent || 0).toLocaleString()}
              </span>
            </div>
            <div className="mt-4">
              <Link
                to={`/jobs/my-campaigns`}
                className="btn btn-outline-primary me-2"
              >
                Edit Campaign
              </Link>
              <button
                className="btn btn-outline-success me-2"
                onClick={onAddFunds}
              >
                Add Funds
              </button>
              <Link
                to={`/jobs/submissions?campaign=${campaign.id}`}
                className="btn btn-outline-secondary"
              >
                View Submissions
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-light rounded-4 p-4 h-100 shadow-sm">
            <div className="fw-bold mb-2">Quick Stats</div>
            <div className="mb-2">
              <span className="text-success fw-bold">
                {relatedSubmissions.length}
              </span>{" "}
              submissions
            </div>
            <div className="mb-2">
              <span className="text-warning fw-bold">
                {
                  relatedSubmissions.filter((s) => s.status === "pending")
                    .length
                }
              </span>{" "}
              pending reviews
            </div>
            <div>
              <span className="text-secondary fw-bold">
                {
                  relatedSubmissions.filter((s) => s.status === "approved")
                    .length
                }
              </span>{" "}
              approved
            </div>
          </div>
        </div>
      </div>
      <div className="alert alert-secondary rounded-4 shadow-sm">
        See campaign analytics, edit details, fund your jobs, or review worker
        submissions.
      </div>
    </div>
  );
}
