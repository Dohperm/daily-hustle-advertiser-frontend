import React, { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Modal,
  InputGroup,
  Pagination,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import {
  Eye,
  CheckCircle,
  ShieldX,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react";

// --- DEMO DATA for categories, etc. ---
const categoriesData = {
  Instagram: ["Follow", "Like", "Share"],
  Facebook: ["Like", "Share", "Group Join"],
  Youtube: ["Like", "Comment", "Subscribe"],
  //... add more as you need
};
const countryOptions = [
  "All Worldwide",
  "Nigeria",
  "Africa",
  "United States",
  "Canada",
  "United Kingdom",
];
const approvalModeOptions = ["Self Approval", "Platform Approval"];
const reviewTypeOptions = ["Open", "Closed"];
const TINYMCE_API_KEY = "vd6rmi2kajnxr70fb4qd3c9urje5qczvcoohhywwl6sbawpf";
const PLATFORM_FEE_PERCENT = 0.1;

// --- Example initial job/campaign state ---
const initialCampaign = {
  title: "Follow Us",
  jobDescription: "Please follow our Instagram page.",
  instructions: "1. Open our Instagram\n2. Click follow\n3. Like last 3 posts.",
  country: "Nigeria",
  category: "Instagram",
  subCategory: "Follow",
  workersNeeded: 25,
  amountPerWorker: 300,
  approvalDays: 3,
  jobsLink: "https://instagram.com/dailyhustle",
  approvalMode: "Platform Approval",
  file: null,
  reviewType: "Open",
  reviewText: "Share why you like our page.",
  closedReviewTexts: [],
  rewardCurrency: "NGN",
};

// --- Example workers list for demo ---
const initialSubmissions = Array.from({ length: 14 }, (_, idx) => ({
  id: `w${100 + idx}`,
  workerId: `${100 + idx}`,
  username: `worker_${100 + idx}`,
  status: idx % 3 === 0 ? "pending" : idx % 3 === 1 ? "approved" : "rejected",
  proofText: "Here's proof with a short note.",
  proofImage: "https://picsum.photos/seed/" + (199 + idx) + "/180/120",
  date: new Date(Date.now() - 1000 * 60 * 60 * 2 * idx).toISOString(),
  blacklisted: false,
}));

// --- Helper functions for status display and filtering ---
function formatStatus(status) {
  if (typeof status === "string" && status.length > 0)
    return status.charAt(0).toUpperCase() + status.slice(1);
  return "N/A";
}
function badgeVariant(status) {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  if (status === "rejected") return "danger";
  if (status === "blacklisted") return "dark";
  return "secondary";
}
// For Filter Dropdown Label
function filterLabel(val) {
  if (val === "all") return "All";
  if (val === "approved") return "Submission Approved";
  if (val === "pending") return "Submission Pending";
  if (val === "rejected") return "Submission Rejected";
  if (val === "blacklisted") return "Blacklisted";
  return formatStatus(val);
}

// --- Main Page ---
export default function ViewCampaignPage() {
  // --- Form state ---
  const [form, setForm] = useState(initialCampaign);

  // --- Workers/submissions state ---
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // --- Modal state for viewing worker proof ---
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // --- Filter ---
  const [filter, setFilter] = useState("all");

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const pageSize = 8;
  // Filtering for list
  const filteredSubs = submissions.filter((s) =>
    filter === "all"
      ? true
      : filter === "approved"
      ? s.status === "approved"
      : filter === "pending"
      ? s.status === "pending"
      : filter === "rejected"
      ? s.status === "rejected"
      : filter === "blacklisted"
      ? s.status === "blacklisted" || s.blacklisted
      : true
  );
  const pageCount = Math.ceil(filteredSubs.length / pageSize);
  const paginatedSubs = filteredSubs.slice((page - 1) * pageSize, page * pageSize);

  // --- Edit form handlers ---
  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }
  function handleSave(e) {
    e.preventDefault();
    alert("Campaign updated!");
  }
  function handleCancel() {
    setForm(initialCampaign);
  }

  // --- Worker proof modal logic ---
  function openWorkerModal(sub) {
    setSelectedWorker(sub);
    setShowWorkerModal(true);
  }
  function closeWorkerModal() {
    setShowWorkerModal(false);
    setSelectedWorker(null);
  }
  function updateSubmissionStatus(id, newStatus) {
    setSubmissions((subs) =>
      subs.map((s) =>
        s.id === id ? { ...s, status: newStatus } : s
      )
    );
    closeWorkerModal();
  }
  function blacklistWorker(id) {
    setSubmissions((subs) =>
      subs.map((s) =>
        s.id === id ? { ...s, blacklisted: true, status: "blacklisted" } : s
      )
    );
    closeWorkerModal();
  }
  function approveAll() {
    setSubmissions((subs) => subs.map((s) => ({ ...s, status: "approved" })));
  }
  function blacklistAll() {
    setSubmissions((subs) =>
      subs.map((s) => ({ ...s, blacklisted: true, status: "blacklisted" }))
    );
  }
  function goToPage(p) {
    setPage(p);
  }

  // --- Budget ---
  const baseTotal = (parseInt(form.workersNeeded) || 0) * (parseFloat(form.amountPerWorker) || 0);
  const platformCharge = baseTotal * PLATFORM_FEE_PERCENT;
  const totalBudget = baseTotal + platformCharge;

  // --- Render ---
  return (
    <div className="container py-4">
      {/* Editable Campaign Form */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body>
          <h2 className="fw-bold mb-3 text-primary">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Campaign / Job
          </h2>
          <Form onSubmit={handleSave}>
            <Row className="g-3">
              <Col md={6}>
                {/* Title */}
                <Form.Group>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                  />
                </Form.Group>
                {/* Category/Subcat/Country */}
                <Form.Group className="mt-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {Object.keys(categoriesData).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Control
                    name="subCategory"
                    value={form.subCategory}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
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
                {/* Workers, Amount */}
                <Form.Group className="mt-3">
                  <Form.Label>Workers Needed</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="workersNeeded"
                    value={form.workersNeeded}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Amount Per Worker</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="amountPerWorker"
                    value={form.amountPerWorker}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              {/* --- JOB INFO COL --- */}
              <Col md={6}>
                {/* Job desc, instr, link */}
                <Form.Group>
                  <Form.Label>Job Description</Form.Label>
                  <Editor
                    apiKey={TINYMCE_API_KEY}
                    value={form.jobDescription}
                    onEditorChange={(c) =>
                      setForm((f) => ({ ...f, jobDescription: c }))
                    }
                    init={{
                      height: 100,
                      menubar: false,
                      toolbar: false,
                    }}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Instructions</Form.Label>
                  <Editor
                    apiKey={TINYMCE_API_KEY}
                    value={form.instructions}
                    onEditorChange={(c) =>
                      setForm((f) => ({ ...f, instructions: c }))
                    }
                    init={{
                      height: 120,
                      menubar: false,
                      toolbar: false,
                    }}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Job/Social Link</Form.Label>
                  <Form.Control
                    name="jobsLink"
                    value={form.jobsLink}
                    onChange={handleChange}
                  />
                </Form.Group>
                {/* Approval Mode, Days, Review Type */}
                <Form.Group className="mt-3">
                  <Form.Label>Approval Mode</Form.Label>
                  <Form.Select
                    name="approvalMode"
                    value={form.approvalMode}
                    onChange={handleChange}
                  >
                    {approvalModeOptions.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Approval Days</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="approvalDays"
                    value={form.approvalDays}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Review Type</Form.Label>
                  <Form.Select
                    name="reviewType"
                    value={form.reviewType}
                    onChange={handleChange}
                  >
                    {reviewTypeOptions.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {/* Review Text/Closed Options */}
                <Form.Group className="mt-3">
                  <Form.Label>
                    {form.reviewType === "Open"
                      ? "Review Text"
                      : "Closed Review Options"}
                  </Form.Label>
                  {form.reviewType === "Open" ? (
                    <Form.Control
                      name="reviewText"
                      value={form.reviewText}
                      onChange={handleChange}
                      placeholder="Enter review question"
                    />
                  ) : (
                    <div>
                      {form.closedReviewTexts.map((text, idx) => (
                        <InputGroup className="mb-2" key={idx}>
                          <Form.Control
                            value={text}
                            onChange={(e) => {
                              const arr = [...form.closedReviewTexts];
                              arr[idx] = e.target.value;
                              setForm((f) => ({
                                ...f,
                                closedReviewTexts: arr,
                              }));
                            }}
                          />
                          <Button
                            variant="outline-danger"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                closedReviewTexts: f.closedReviewTexts.filter(
                                  (_, i) => i !== idx
                                ),
                              }))
                            }
                            tabIndex={-1}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </InputGroup>
                      ))}
                      <Button
                        variant="outline-primary"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            closedReviewTexts: [...f.closedReviewTexts, ""],
                          }))
                        }
                      >
                        Add Option
                      </Button>
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Attachment (Image/pdf, optional)</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Budget summary */}
            <hr />
            <Row>
              <Col md={4}>
                <div className="mb-2">
                  <span className="fw-bold text-muted">Base Pay:</span>{" "}
                  <span>₦{baseTotal.toLocaleString()}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-2">
                  <span className="fw-bold text-muted">Platform Fee:</span>{" "}
                  <span>₦{platformCharge.toLocaleString()}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-2 fw-bold text-success">
                  Total Budget: ₦{totalBudget.toLocaleString()}
                </div>
              </Col>
            </Row>
            {/* Save/Cancel buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button type="button" variant="dark" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="success" className="fw-bold">
                Save
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Submissions Section */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <h5 className="fw-bold mb-0">
                Task Responses ({filteredSubs.length})
              </h5>
              {/* Filter Dropdown */}
              <DropdownButton
                id="submissions-filter"
                variant="outline-secondary"
                title={filterLabel(filter)}
                onSelect={setFilter}
                size="sm"
              >
                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                <Dropdown.Item eventKey="approved">Submission Approved</Dropdown.Item>
                <Dropdown.Item eventKey="pending">Submission Pending</Dropdown.Item>
                <Dropdown.Item eventKey="rejected">Submission Rejected</Dropdown.Item>
                <Dropdown.Item eventKey="blacklisted">Blacklisted</Dropdown.Item>
              </DropdownButton>
            </div>
            {/* Bulk Actions */}
            <div className="d-flex gap-2">
              <Button variant="success" onClick={approveAll} size="sm">
                <CheckCircle size={16} className="me-1" /> Approve All
              </Button>
              <Button variant="dark" onClick={blacklistAll} size="sm">
                <ShieldX size={16} className="me-1" /> Blacklist All
              </Button>
            </div>
          </div>
          {/* List with proof View as button */}
          <ListGroup variant="flush">
            {paginatedSubs.map((sub) => (
              <ListGroup.Item
                key={sub.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div>
                    <strong>#{sub.workerId}</strong> {sub.username}
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openWorkerModal(sub)}
                      className="d-inline-flex align-items-center gap-1 mt-1"
                      style={{ fontWeight: 500, fontSize: "0.96rem" }}
                    >
                      <span>
                        <i className="bi bi-camera me-1"></i>
                        View proof
                      </span>
                    </Button>
                  </div>
                  <small className="text-muted">
                    {new Date(sub.date).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge
                    bg={badgeVariant(sub.status)}
                    className="text-uppercase"
                  >
                    {formatStatus(sub.status)}
                  </Badge>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openWorkerModal(sub)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => blacklistWorker(sub.id)}
                    title="Blacklist"
                  >
                    <ShieldX size={16} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* Pagination controls */}
          {pageCount > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                {[...Array(pageCount)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === page}
                    onClick={() => goToPage(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Worker Proof Modal */}
      <Modal
        show={showWorkerModal}
        onHide={closeWorkerModal}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Worker #{selectedWorker?.workerId}{" "}
            <span className="ms-2">{selectedWorker?.username}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorker && (
            <>
              <div className="mb-3">
                <strong>Proof Text:</strong>
                <p className="mb-2">
                  {selectedWorker.proofText || <i>No text provided.</i>}
                </p>
              </div>
              <div className="mb-3">
                <strong>Proof Image:</strong>
                <div>
                  {selectedWorker.proofImage ? (
                    <img
                      src={selectedWorker.proofImage}
                      alt="Proof"
                      style={{
                        maxWidth: "92%",
                        borderRadius: "10px",
                        boxShadow: "0 2px 10px rgba(40,13,66,0.12)",
                      }}
                    />
                  ) : (
                    <i>No image provided.</i>
                  )}
                </div>
              </div>
              <div className="mt-3 text-end">
                <Badge
                  bg={badgeVariant(selectedWorker.status)}
                  className="text-uppercase px-2 py-1 fs-7"
                >
                  {formatStatus(selectedWorker.status)}
                </Badge>
                {selectedWorker.blacklisted && (
                  <Badge bg="dark" className="ms-2">
                    Blacklisted
                  </Badge>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!selectedWorker?.blacklisted && (
            <>
              <Button
                variant="success"
                onClick={() =>
                  updateSubmissionStatus(selectedWorker.id, "approved")
                }
              >
                <ThumbsUp size={16} className="me-1" />
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  updateSubmissionStatus(selectedWorker.id, "rejected")
                }
              >
                <ThumbsDown size={16} className="me-1" />
                Reject
              </Button>
              <Button
                variant="dark"
                onClick={() => blacklistWorker(selectedWorker.id)}
              >
                <ShieldX size={16} className="me-1" />
                Blacklist
              </Button>
            </>
          )}
          <Button variant="outline-secondary" onClick={closeWorkerModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
