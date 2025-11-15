import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Modal,
  Pagination,
  DropdownButton,
  Dropdown,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import {
  Eye,
  ShieldX,
  Edit,
  ArrowRight,
  UploadCloud,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useParams } from "react-router-dom";
import {
  advertiserViewTask,
  advertiserUpdateTask,
  advertiserListSubmissions,
  advertiserUpdateTaskProofStatus,
  uploadFile,
} from "../services/services";

const PLATFORM_FEE_PERCENT = 0.1;
const TINYMCE_API_KEY = "vd6rmi2kajnxr70fb4qd3c9urje5qczvcoohhywwl6sbawpf";
const CURRENCIES = ["NGN", "USD", "GBP", "EUR"];
const approvalModeOptions = ["Self Approval", "Platform Approval"];
const reviewTypeOptions = ["Closed", "Open"];
const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/dlk3pswf9/image/upload/v1762626894/uploads/b4befbe5efc249c9293664ec8b453ce0_WhatsApp%20Image%202025-10-22%20at%2013.06.24_9062d9a5.jpg";

function mapApprovalModeToApi(val) {
  if (val === "Self Approval") return "Self";
  if (val === "Platform Approval") return "Platform";
  return "";
}
function mapApprovalModeFromApi(val) {
  if (val === "Self") return "Self Approval";
  if (val === "Platform") return "Platform Approval";
  return "";
}

export default function ViewCampaignPage() {
  const { param: taskId } = useParams();
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    sub_category: "",
    country: "",
    workersNeeded: "",
    amountPerWorker: "",
    instructions: "",
    jobsLink: "",
    approvalMode: "",
    approvalDays: "",
    rewardCurrency: "NGN",
    slots: { max: "", used: "" },
    attachment: "",
    task_site: "",
    review_type: "Closed",
    uploadingImage: false,
  });

  const [imgBroken, setImgBroken] = useState(false);
  const [showGoTo, setShowGoTo] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsError, setSubsError] = useState("");
  const [subsPage, setSubsPage] = useState(1);
  const [subsTotal, setSubsTotal] = useState(0);
  const [subsPageSize, setSubsPageSize] = useState(10);

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await advertiserViewTask(taskId);
        const data = res.data?.data || {};
        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          sub_category: data.sub_category || "",
          country: data.country || "",
          workersNeeded: data.slots?.max || "",
          amountPerWorker: data.reward?.amount_per_worker || "",
          instructions: data.instructions || "",
          jobsLink: data.jobsLink || data.task_site || "",
          approvalMode: mapApprovalModeFromApi(data.approval?.mode) || "",
          approvalDays: data.approval?.num_days || "",
          rewardCurrency: CURRENCIES.includes(data.reward?.currency)
            ? data.reward.currency
            : "NGN",
          slots: data.slots || { max: "", used: "" },
          attachment: data.attachment || "",
          task_site: data.task_site || "",
          review_type: data.review_type || "Closed",
          uploadingImage: false,
        });
        setShowGoTo(!!(data.jobsLink || data.task_site));
      } catch (err) {}
    }
    if (taskId) loadTask();
    // eslint-disable-next-line
  }, [taskId]);

  useEffect(() => {
    async function loadSubs() {
      setSubsLoading(true);
      setSubsError("");
      try {
        const res = await advertiserListSubmissions(
          taskId,
          subsPage,
          subsPageSize
        );
        const arr = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
        setSubmissions(arr);
        setSubsTotal(res.data?.data?.metadata?.total || arr.length);
        setSubsPageSize(res.data?.data?.metadata?.limit || 10);
      } catch (err) {
        setSubsError("Failed to load submissions.");
        setSubmissions([]);
      } finally {
        setSubsLoading(false);
      }
    }
    if (taskId) loadSubs();
    // eslint-disable-next-line
  }, [taskId, subsPage, subsPageSize]);

  useEffect(() => {
    if (form.review_type === "Open") {
      setForm((prev) => ({
        ...prev,
        closed_review_options: ["NO"],
      }));
    } else if (form.review_type === "Closed") {
      setForm((prev) => ({
        ...prev,
        closed_review_options: ["YES"],
      }));
    }
  }, [form.review_type]);

  const filteredSubs = submissions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "approved" || filter === "pending" || filter === "rejected")
      return s.status === filter || s.is_approved === (filter === "approved");
    if (filter === "blacklisted")
      return s.status === "blacklisted" || s.blacklisted;
    return true;
  });

  const handleSave = async () => {
    const selectedCurrency = CURRENCIES.includes(form.rewardCurrency)
      ? form.rewardCurrency
      : "NGN";
    const closedReview = form.review_type === "Open" ? ["NO"] : ["YES"];
    try {
      await advertiserUpdateTask(taskId, {
        ...form,
        approval: {
          mode: mapApprovalModeToApi(form.approvalMode),
          num_days: form.approvalDays,
        },
        reward: {
          currency: selectedCurrency,
          amount_per_worker: form.amountPerWorker,
        },
        slots: {
          max: form.workersNeeded,
        },
        closed_review_options: closedReview,
        attachment: form.attachment,
      });
      setEditMode(false);
      setForm((p) => ({
        ...p,
        closed_review_options: closedReview,
      }));
    } catch {}
  };

  const filterLabel = (val) => {
    const labels = {
      all: "All",
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected",
      blacklisted: "Blacklisted",
    };
    return labels[val] || val;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShowProof = (worker) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };
  const handleCloseProof = () => {
    setShowWorkerModal(false);
    setSelectedWorker(null);
  };
  const handleFilterSelect = (k) => {
    setFilter(k);
    setSubsPage(1);
  };

  const handleImageUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgBroken(false);
    setForm((prev) => ({ ...prev, uploadingImage: true }));
    try {
      const res = await uploadFile(file);
      const imgUrl = res.data?.data?.[0]?.src;
      if (imgUrl) {
        setForm((prev) => ({
          ...prev,
          attachment: imgUrl,
          uploadingImage: false,
        }));
      }
    } catch {
      setForm((prev) => ({ ...prev, uploadingImage: false }));
    }
  };

  const handleProofStatusChange = async (proofId, status) => {
    try {
      await advertiserUpdateTaskProofStatus(proofId, {
        approval_status: status,
      });
      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === proofId
            ? {
                ...s,
                status,
                is_approved: status === "approved",
                blacklisted: status === "blacklisted",
              }
            : s
        )
      );
      if (selectedWorker?._id === proofId) {
        setSelectedWorker((prev) =>
          prev
            ? {
                ...prev,
                status,
                is_approved: status === "approved",
                blacklisted: status === "blacklisted",
              }
            : prev
        );
      }
    } catch {}
  };

  return (
    <div className="container py-4">
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-primary">Campaign Details</h2>
            <Button
              variant={editMode ? "outline-danger" : "primary"}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? (
                "Cancel"
              ) : (
                <>
                  <Edit size={16} className="me-1" /> Edit
                </>
              )}
            </Button>
          </div>
          <Form>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    name="category"
                    value={form.category || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Control
                    name="sub_category"
                    value={form.sub_category || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    name="country"
                    value={form.country || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Workers Needed</Form.Label>
                  <Form.Control
                    type="number"
                    name="workersNeeded"
                    value={form.workersNeeded || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Amount Per Worker ({form.rewardCurrency || ""})
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amountPerWorker"
                    value={form.amountPerWorker || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Reward Currency</Form.Label>
                  <Form.Select
                    name="rewardCurrency"
                    value={form.rewardCurrency || "NGN"}
                    onChange={handleChange}
                    disabled={!editMode}
                  >
                    {CURRENCIES.map((cur) => (
                      <option value={cur} key={cur}>
                        {cur}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Slot Info</Form.Label>
                  <div>
                    Max: {form.slots?.max ?? "-"}, Used:{" "}
                    {form.slots?.used ?? "-"}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Description</Form.Label>
                  {editMode ? (
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      value={form.description || ""}
                      onEditorChange={(content) =>
                        setForm((prev) => ({
                          ...prev,
                          description: content,
                        }))
                      }
                      init={{
                        height: 120,
                        menubar: false,
                        branding: false,
                        toolbar: "bold italic underline | bullist numlist",
                        readonly: !editMode,
                      }}
                    />
                  ) : (
                    <div
                      className="p-2"
                      style={{
                        background: "#f8f9fa",
                        borderRadius: 8,
                        minHeight: 60,
                      }}
                      dangerouslySetInnerHTML={{ __html: form.description }}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Instructions</Form.Label>
                  {editMode ? (
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      value={form.instructions || ""}
                      onEditorChange={(content) =>
                        setForm((prev) => ({
                          ...prev,
                          instructions: content,
                        }))
                      }
                      init={{
                        height: 120,
                        menubar: false,
                        branding: false,
                        toolbar: "bold italic underline | bullist numlist",
                        readonly: !editMode,
                      }}
                    />
                  ) : (
                    <div
                      className="p-2"
                      style={{
                        background: "#f8f9fa",
                        borderRadius: 8,
                        minHeight: 60,
                      }}
                      dangerouslySetInnerHTML={{ __html: form.instructions }}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Task Link{" "}
                    {!editMode && (form.jobsLink || form.task_site) && (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={form.jobsLink || form.task_site}
                        className="ms-2"
                        style={{
                          fontWeight: 700,
                          color: "#146c43",
                          textDecoration: "none",
                        }}
                      >
                        Go to <ArrowRight size={14} />
                      </a>
                    )}
                  </Form.Label>
                  <Form.Control
                    name="jobsLink"
                    value={form.jobsLink || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Attachment</Form.Label>
                  <div className="d-flex align-items-start gap-3">
                    <img
                      src={
                        !imgBroken && form.attachment
                          ? form.attachment
                          : PLACEHOLDER_IMAGE
                      }
                      onError={() => setImgBroken(true)}
                      alt="Attachment"
                      className="img-fluid mb-2"
                      style={{
                        maxWidth: "180px",
                        maxHeight: "120px",
                        borderRadius: "10px",
                        border: "1px solid #eee",
                        objectFit: "cover",
                      }}
                    />
                    {editMode && (
                      <div>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageUploadChange}
                          disabled={form.uploadingImage}
                        />
                        {form.uploadingImage && (
                          <Spinner
                            animation="border"
                            size="sm"
                            className="mt-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Approval Mode</Form.Label>
                  <Form.Select
                    name="approvalMode"
                    value={form.approvalMode || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  >
                    <option value="">Select...</option>
                    {approvalModeOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Approval Days</Form.Label>
                  <Form.Control
                    type="number"
                    name="approvalDays"
                    value={form.approvalDays || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Review Type</Form.Label>
                  <Form.Select
                    name="review_type"
                    value={form.review_type || "Closed"}
                    onChange={handleChange}
                    disabled={!editMode}
                  >
                    {reviewTypeOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {editMode && (
              <div className="text-end mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setEditMode(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleSave}
                  disabled={form.uploadingImage}
                >
                  {form.uploadingImage ? (
                    <>
                      <Spinner animation="border" size="sm" /> Uploading
                      image...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Submissions ({subsTotal})</h5>
            <DropdownButton
              title={filterLabel(filter)}
              variant="outline-secondary"
              size="sm"
              onSelect={handleFilterSelect}
            >
              {["all", "approved", "pending", "rejected", "blacklisted"].map(
                (key) => (
                  <Dropdown.Item key={key} eventKey={key}>
                    {filterLabel(key)}
                  </Dropdown.Item>
                )
              )}
            </DropdownButton>
          </div>
          {subsLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" className="mb-2" />
              <div>Loading submissions...</div>
            </div>
          ) : subsError ? (
            <Alert variant="danger">{subsError}</Alert>
          ) : filteredSubs.length === 0 ? (
            <Alert variant="info">No submissions found.</Alert>
          ) : (
            <>
              <ListGroup variant="flush">
                {filteredSubs.map((sub) => (
                  <ListGroup.Item key={sub._id} className="px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Worker #{sub.user_id}</strong>{" "}
                        <small className="text-muted">
                          {sub.date ? new Date(sub.date).toLocaleString() : ""}
                        </small>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 ms-2"
                          onClick={() => handleShowProof(sub)}
                        >
                          View Proof
                        </Button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge
                          bg={
                            sub.status === "approved" || sub.is_approved
                              ? "success"
                              : sub.status === "pending"
                              ? "warning"
                              : sub.status === "rejected"
                              ? "danger"
                              : sub.status === "blacklisted"
                              ? "dark"
                              : "secondary"
                          }
                        >
                          {sub.status ||
                            (sub.is_approved ? "approved" : "pending")}
                        </Badge>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            handleProofStatusChange(sub._id, "approved")
                          }
                          disabled={
                            sub.status === "approved" || sub.is_approved
                          }
                        >
                          <ThumbsUp size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleProofStatusChange(sub._id, "rejected")
                          }
                          disabled={sub.status === "rejected"}
                        >
                          <ThumbsDown size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            handleProofStatusChange(sub._id, "blacklisted")
                          }
                          disabled={sub.status === "blacklisted"}
                        >
                          <ShieldX size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleShowProof(sub)}
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {subsTotal > subsPageSize && (
                <Pagination className="justify-content-center mt-4">
                  {Array.from(
                    { length: Math.ceil(subsTotal / subsPageSize) },
                    (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === subsPage}
                        onClick={() => setSubsPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    )
                  )}
                </Pagination>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      <Modal
        show={showWorkerModal}
        onHide={handleCloseProof}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Proof by Worker #{selectedWorker?.user_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorker && (
            <>
              {selectedWorker.proof_text && (
                <div className="mb-4">
                  <strong>Text Proof:</strong>
                  <div className="border rounded p-3 mt-2 bg-light">
                    {selectedWorker.proof_text}
                  </div>
                </div>
              )}
              {selectedWorker.proof_image && (
                <div className="mb-4 text-center">
                  <strong>Image Proof:</strong>
                  <div className="mt-2">
                    <img
                      src={selectedWorker.proof_image}
                      alt="Proof"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                </div>
              )}
              {!selectedWorker.proof_text && !selectedWorker.proof_image && (
                <Alert variant="warning">No proof submitted.</Alert>
              )}
              <div className="text-end">
                <Badge bg="secondary">
                  Status:{" "}
                  {selectedWorker.status ||
                    (selectedWorker.is_approved ? "approved" : "pending")}
                </Badge>
                <Button
                  size="sm"
                  variant="success"
                  className="ms-3"
                  onClick={() =>
                    handleProofStatusChange(selectedWorker._id, "approved")
                  }
                  disabled={
                    selectedWorker.status === "approved" ||
                    selectedWorker.is_approved
                  }
                >
                  <ThumbsUp size={16} /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="ms-3"
                  onClick={() =>
                    handleProofStatusChange(selectedWorker._id, "rejected")
                  }
                  disabled={selectedWorker.status === "rejected"}
                >
                  <ThumbsDown size={16} /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-3"
                  onClick={() =>
                    handleProofStatusChange(selectedWorker._id, "blacklisted")
                  }
                  disabled={selectedWorker.status === "blacklisted"}
                >
                  <ShieldX size={16} /> Blacklist
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProof}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
