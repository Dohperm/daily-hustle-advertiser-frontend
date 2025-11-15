import React, { useState } from "react";
import { Accordion } from "react-bootstrap";

export default function AdvertiserSupport() {
  const [ticket, setTicket] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((t) => ({ ...t, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with actual ticket submission logic/API call
    setSubmitted(true);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-headset text-info me-2" />
        Support & Help
      </h2>

      <div className="row g-4">
        {/* FAQ SECTION */}
        <div className="col-lg-6">
          <div className="bg-white rounded-4 p-3 shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Common Questions</h5>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  How do I create a new campaign?
                </Accordion.Header>
                <Accordion.Body>
                  Go to the <strong>“New Campaign”</strong> page, fill out all
                  campaign details, and click “Post jobs.”
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>How can I add more funds?</Accordion.Header>
                <Accordion.Body>
                  On your <strong>Wallet</strong> page, click “Add Funds.” You
                  can top-up by card, transfer, or other supported payment
                  methods.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  How do I review worker submissions?
                </Accordion.Header>
                <Accordion.Body>
                  On your <strong>Review Submissions</strong> page under jobs,
                  you can approve or reject proofs submitted by workers.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>How do I contact support?</Accordion.Header>
                <Accordion.Body>
                  Use the form here or email{" "}
                  <a href="mailto:support@dailyhustle.com">
                    support@dailyhustle.com
                  </a>{" "}
                  for any account or campaign issues.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>

        {/* SUPPORT FORM SECTION */}
        <div className="col-lg-6">
          <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Open a Support Ticket</h5>
            {submitted ? (
              <div className="alert alert-success">
                Support ticket submitted. Our team will contact you soon!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    className="form-control"
                    name="subject"
                    value={ticket.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    value={ticket.message}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-info text-white fw-bold"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
          <div className="alert alert-light mt-3">
            Or email{" "}
            <a href="mailto:support@dailyhustle.com">support@dailyhustle.com</a>
            <br />
            <strong>Live chat:</strong> Coming soon to our dashboard!
          </div>
        </div>
      </div>
    </div>
  );
}
