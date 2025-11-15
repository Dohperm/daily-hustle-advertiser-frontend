import React, { useState, useEffect } from "react";

export default function ModalCampaign({
  show,
  onClose,
  mode,
  campaign,
  onCreate,
  onEdit,
}) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    budget: 0,
    description: "",
  });

  useEffect(() => {
    if (mode === "edit" && campaign) setForm({ ...campaign });
    else setForm({ title: "", category: "", budget: 0, description: "" });
  }, [show, mode, campaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    if (mode === "create") onCreate(form);
    else if (mode === "edit") onEdit(form);
    onClose();
  };

  if (!show) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <h5 className="modal-title">
              {mode === "create" ? "Create Campaign" : "Edit Campaign"}
            </h5>
            <div className="mb-3">
              <input
                className="form-control mb-2"
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
              />
              <input
                className="form-control mb-2"
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              />
              <input
                className="form-control mb-2"
                type="number"
                name="budget"
                placeholder="Budget"
                value={form.budget}
                onChange={handleChange}
              />
              <textarea
                className="form-control mb-2"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
