import React from "react";
// import { useAdvertiserData } from "../hooks/useAppDataContext";
const TRAININGS = [
  {
    title: "How to Launch Your First Campaign",
    type: "Video",
    url: "https://www.youtube.com/embed/example1",
    duration: "5:32",
    description:
      "Step-by-step guide to posting and optimizing your first micro-jobs campaign.",
  },
  {
    title: "Best Practices: Worker Proof Review",
    type: "Article",
    url: "/guides/review-tips",
    duration: "",
    description:
      "Tips for efficiently approving, rejecting, and following up on worker submissions for higher campaign ROI.",
  },
  {
    title: "How to Fund Your Wallet",
    type: "Video",
    url: "https://www.youtube.com/embed/example2",
    duration: "3:47",
    description:
      "Walkthrough for topping up wallet, viewing transactions and auto-payments.",
  },
];

export default function Trainings() {
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-journal-text text-info me-2" />
        Training, Tips & Guides
      </h2>
      <div className="row g-4">
        {TRAININGS.map((t, idx) => (
          <div key={idx} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm p-3">
              <h5 className="fw-bold mb-2">{t.title}</h5>
              {t.type === "Video" ? (
                <div className="ratio ratio-16x9 mb-2">
                  <iframe src={t.url} title={t.title} allowFullScreen />
                </div>
              ) : (
                <a
                  href={t.url}
                  className="btn btn-sm btn-outline-info mb-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Guide
                </a>
              )}
              <div className="mb-2 small text-muted">
                {t.duration && (
                  <>
                    <i className="bi bi-clock me-1"></i>
                    {t.duration}
                    {" | "}
                  </>
                )}
                {t.type}
              </div>
              <div className="mb-2">{t.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="alert alert-secondary mt-4">
        Need more help? Visit our <a href="/support">Support</a> page or contact
        our team for onboarding/consultation.
      </div>
    </div>
  );
}
