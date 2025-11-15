// src/components/ApprovalModal.jsx
import React from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

export default function ApprovalModal({ user, onClose }) {
  const isImageProof = user.proof.startsWith("http");

  const handleApprove = () => {
    alert(`✅ ${user.name} has been approved!`);
    onClose();
  };

  const handleReject = () => {
    alert(`❌ ${user.name} has been rejected.`);
    onClose();
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(3px)",
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title fw-bold">
              Approval Review — {user.name}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          <div className="modal-body bg-light">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="fw-bold mb-2 text-dark">User Info</h6>
                <ul className="list-unstyled small">
                  <li>
                    <strong>Name:</strong> {user.name}
                  </li>
                  <li>
                    <strong>Role:</strong> {user.role}
                  </li>
                </ul>
              </div>

              <div className="col-md-6">
                <h6 className="fw-bold mb-2 text-dark">Proof Preview</h6>
                <div
                  className="border rounded-3 bg-white shadow-sm p-2 text-center"
                  style={{ minHeight: "200px" }}
                >
                  {isImageProof ? (
                    <img
                      src={user.proof}
                      alt="User proof"
                      className="img-fluid rounded-3 shadow-sm"
                      style={{ maxHeight: "250px", objectFit: "contain" }}
                    />
                  ) : (
                    <p className="text-muted small text-start mb-0">
                      “{user.proof}”
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white d-flex justify-content-between">
            <div className="text-muted small">
              Verify the provided proof before taking action.
            </div>
            <div>
              <button
                className="btn btn-success rounded-pill px-4 me-2 d-flex align-items-center gap-2"
                onClick={handleApprove}
              >
                <FaCheckCircle /> Approve
              </button>
              <button
                className="btn btn-outline-danger rounded-pill px-4 d-flex align-items-center gap-2"
                onClick={handleReject}
              >
                <FaTimesCircle /> Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
