import React, { useState } from "react";
import { Form, Button, Row, Col, InputGroup, Modal } from "react-bootstrap";

// Substitute with your category/subcategory structure
const categories = {
  affiliate: ["Sign up", "Referral", "Purchase Bonus"],
  app: ["Install only", "Install/Register", "Install & Use"],
  artist: ["Follow", "Stream Song", "Share Music"],
  content: ["Write Article", "Post Blog", "Comment"],
  facebook: ["Like Page", "Share Post", "Join Group"],
  instagram: ["Follow", "Like Post", "Share Story"],
  // Add more as needed
};
const categoryOptions = Object.keys(categories);

const countryOptions = [
  "All Worldwide",
  "Nigeria",
  "Africa",
  "United States",
  "Canada",
  "United Kingdom",
];

export default function CampaignCreate() {
  const [form, setForm] = useState({
    jobsTitle: "",
    jobsDetails: "",
    country: "Nigeria",
    jobsCategory: "",
    subCategory: "",
    workersNeeded: "",
    amountPerWorker: "",
    approvalDays: "3",
    screenshotProof: false,
    jobsLink: "",
    approvalMode: "",
    file: null,
  });
  const [fileName, setFileName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const subCategoryList = form.jobsCategory
    ? categories[form.jobsCategory]
    : [];

  const totalBudget =
    (parseInt(form.workersNeeded, 10) || 0) *
    (parseFloat(form.amountPerWorker) || 0);

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
      setFileName(files[0]?.name || "");
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handlePreview(e) {
    e.preventDefault();
    setShowPreview(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // You'd submit the form here, e.g. via fetch/axios/mutate
    alert("jobs submitted successfully!");
    setForm({
      jobsTitle: "",
      jobsDetails: "",
      country: "Nigeria",
      jobsCategory: "",
      subCategory: "",
      workersNeeded: "",
      amountPerWorker: "",
      approvalDays: "3",
      screenshotProof: false,
      jobsLink: "",
      approvalMode: "",
      file: null,
    });
    setFileName("");
  }

  return (
    <Form onSubmit={handleSubmit} className="p-3 bg-white rounded shadow-sm">
      <h4 className="mb-3 fw-bold text-primary">Create a Campaign</h4>
      <Row className="mb-3">
        <Col md>
          <Form.Group>
            <Form.Label>jobs Title</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-pencil-fill" />
              </InputGroup.Text>
              <Form.Control
                name="jobsTitle"
                value={form.jobsTitle}
                onChange={handleChange}
                placeholder="e.g. Share flyer on WhatsApp groups"
                required
              />
            </InputGroup>
            <Form.Text muted>
              Keep it clear and short, appears in the jobs feed.
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Select
              name="country"
              value={form.country}
              onChange={handleChange}
            >
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>jobs Category</Form.Label>
        <Form.Select
          name="jobsCategory"
          value={form.jobsCategory}
          onChange={handleChange}
          required
        >
          <option value="">Select jobs category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Sub Category</Form.Label>
        <Form.Select
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
          required
          disabled={!form.jobsCategory}
        >
          <option value="">
            {form.jobsCategory
              ? "Select sub category"
              : "Pick a category first"}
          </option>
          {subCategoryList.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>jobs Description & Instructions</Form.Label>
        <Form.Control
          as="textarea"
          name="jobsDetails"
          value={form.jobsDetails}
          onChange={handleChange}
          rows={3}
          placeholder="Explain jobs steps and required proof..."
          required
        />
        <Form.Text muted>
          Explain proof rules clearly to avoid disputes.
        </Form.Text>
      </Form.Group>
      <Row className="mb-3">
        <Col md>
          <Form.Group>
            <Form.Label>Workers Needed</Form.Label>
            <Form.Control
              type="number"
              min={1}
              name="workersNeeded"
              value={form.workersNeeded}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Group>
            <Form.Label>Amount per Worker</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="amountPerWorker"
              value={form.amountPerWorker}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md>
          <Form.Group>
            <Form.Label>Approval Days</Form.Label>
            <Form.Control
              type="number"
              min={1}
              name="approvalDays"
              value={form.approvalDays}
              onChange={handleChange}
              required
            />
            <Form.Text muted>Max days before auto-approval.</Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md>
          <Form.Check
            type="checkbox"
            name="screenshotProof"
            label="Require Screenshot Proof"
            checked={form.screenshotProof}
            onChange={handleChange}
          />
        </Col>
        <Col md>
          <Form.Group>
            <Form.Label>Attachment (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            {fileName && (
              <div className="small text-muted mt-1">{fileName}</div>
            )}
          </Form.Group>
        </Col>
        <Col md>
          <Form.Group>
            <Form.Label>jobs Link (optional)</Form.Label>
            <Form.Control
              name="jobsLink"
              value={form.jobsLink}
              onChange={handleChange}
              placeholder="https://example.com"
              type="url"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md>
          <Form.Group>
            <Form.Label>Approval Model</Form.Label>
            <Form.Select
              name="approvalMode"
              value={form.approvalMode}
              onChange={handleChange}
              required
            >
              <option value="">Select approval mode</option>
              <option>Self Approval</option>
              <option>Platform Approval</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md className="d-flex align-items-end">
          <div className="total-box bg-light rounded p-3 w-100">
            <div className="small text-muted">Estimated Total</div>
            <div
              className="fw-bold text-success"
              style={{ fontSize: "1.35rem" }}
            >
              ₦{totalBudget.toLocaleString()}
            </div>
          </div>
        </Col>
      </Row>
      <div className="d-flex gap-2 justify-content-end">
        <Button variant="outline-dark" type="button" onClick={handlePreview}>
          Preview
        </Button>
        <Button variant="primary" type="submit">
          Post jobs
        </Button>
      </div>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Campaign Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{form.jobsTitle || "jobs title preview"}</h5>
          <div className="small text-muted mb-2">
            {form.jobsCategory} / {form.subCategory} / {form.country} <br />
            {totalBudget} total
          </div>
          <div className="mb-2">
            {form.jobsDetails || "jobs description preview..."}
          </div>
          <div className="d-flex gap-3 flex-wrap mb-2">
            <span>
              <i className="bi bi-people-fill me-1" />
              {form.workersNeeded || 0} worker(s)
            </span>
            <span>
              <i className="bi bi-clock me-1" />
              {form.approvalDays || 0} days
            </span>
            <span>
              <i className="bi bi-geo-alt me-1" />
              {form.country}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowPreview(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}
