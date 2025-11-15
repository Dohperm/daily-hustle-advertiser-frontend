import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Form,
  Button,
  Row,
  Col,
  Modal,
  Card,
  Badge,
  Alert,
  InputGroup,
  Spinner,
  Table,
} from "react-bootstrap";

import { Editor } from "@tinymce/tinymce-react";
import {
  Trash2,
  Upload,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import Papa from "papaparse";
import { advertiserCreateTask, uploadFile } from "../services/services";

// Categories data (same as before)

const categoriesData = {
  "Affiliate Rewards": [
    "Top of Form",
    "Mobile App Invites (Bounty)",
    "Course Sale (Bounty)",
    "Software Sales (Bounty)",
    "Cashback Sale (Bounty)",
  ],
  "App Download": [
    "Mobile Gameplay",
    "Blogpost App Review (Bounty)",
    "Mobile App Download",
    "Sign Up & Review (Bounty)",
    "Mobile App Download & Sign Up + Deposit (Bounty)",
    "Mobile App Download, KYC Sign Up & Additional Task (Bounty)",
  ],
  "Artist Engagement": [
    "Spotify Follow",
    "Shazam Music",
    "Shazam Follow",
    "Boomplay Follow",
    "AudioMack Follow",
    "AudioMack Favorite",
    "Boomplay Favourite",
    "AudioMack Comment",
    "Shazam Song & Follow Artist",
    "Spotify Follow & Save playlist",
    "Boomplay Favorite & Comment",
    "AudioMack Favorite & Comment",
    "Boomplay Follow, Favorite & Comment",
    "AudioMack Follow, Favorite & Comment",
  ],
  "Content Rewards": [
    "UGC Content (Bounty)",
    "Reaction Video (Bounty)",
    "Fanpage With 10 Posts (Bounty)",
    "Fanpage With 50 Posts (Bounty)",
    "Fanpage With 100 Posts (Bounty)",
    "Create a Meme Series (10 Slides)",
    "Public Reaction Bounty (Street Interview)",
    "Behind-the-Scenes or Explainer Edit (Bounty)",
    "UGC Content Bounty with 10K Views (Bounty)",
    "UGC Content Bounty with 50K Views (Bounty)",
    "UGC Content Bounty with 100K+ Views (Bounty)",
  ],
  Discord: ["Like/React", "Join Server", "Join Channel"],
  Facebook: [
    "Like",
    "Share",
    "Follow",
    "Comment",
    "Add Friend",
    "Join Group",
    "Like & Comment",
    "Share & Comment",
    "Post On Facebook",
    "Like, Share & Comment",
    "Follow Page & Like Post",
  ],
  Instagram: [
    "Like",
    "Save",
    "Follow",
    "Comment",
    "Follow & Like",
    "Like & Comment",
    "Live Engagement",
    "Repost To Insta-feed",
    "Repost To Insta-Story",
    "Like, Comment & Save",
    "Watch Video & Comment (Bounty)",
    "Like, Comment & Comment Likes + Reply",
  ],
  LinkedIn: [
    "Like",
    "Repost",
    "Connect",
    "Comment",
    "Follow & Like",
    "Follow, Like ",
    "Follow, Like & Comment",
  ],
  "Online Vote": [
    "Website Vote",
    "Facebook Vote",
    "Sign Up & Vote",
    "Instagram Post Vote",
    "Vote & Email Confirmation",
    "Paid Vote (Bounty)",
    "Vote Via SMS (Bounty)",
    "Complex Vote (Multiple Survey, Email, Phone Verification)",
  ],
  Review: ["Facebook Page" ,"Google Review",
      "Facebook Review",
      "Trust Pilot Review",],
  "Sign Up": [
    "Forum Sign Up (Bounty)",
    "Quick Email Sign Up (Bounty)",
    "Sign Up & Submit KYC (Bounty)",
    "Detailed Sign Up (Bounty)",
    "Sign Up + Additional Task (Bounty)",
    "Sign Up + Deposit (Bounty)",
    "Verify Email & Mobile Number",
  ],
  Snapchat: ["View All Story (Public Only)", "Snapchat Follow/Subscribe"],
  "Stream Music": [
    "Stream on Boomplay & Share (Bounty)",
    "Stream Music on Spotify & Share (Bounty)",
    "Stream Music on Apple Music & Share (Bounty)",
    "Stream on AudioMack & Share (Bounty)",
    "Stream on YouTube Music & Share (Bounty)",
    "Stream Music on Tidal & Share (Bounty)",
    "Stream on Deezer & Share (Bounty)",
  ],
  Survey: [
    "10 Questions (Bounty)",
    "20 Questions (Bounty)",
    "30 Questions (Bounty)",
  ],
  Telegram: ["Bot Join", "Group Join", "Simple Air Drop", "Complex Air Drop"],
  Threads: ["Like", "Quote", "Follow", "Repost", "Comment", "Like & Comment"],
  Tiktok: [
    "Like",
    "Follow",
    "Comment",
    "Like & Share",
    "Like & Comment",
    "Follow, Like & Comment",
  ],
  "Twitter [X]": [
    "Vote",
    "Like",
    "Tweet",
    "Follow",
    "Retweet",
    "Follow & Like",
    "Reply (Tweet)",
    "Retweet & Like",
    "Retweet & Reply",
    "Follow & Retweet",
    "Retweet, Like & Reply",
    "Follow, Like & Retweet",
    "Vote On Twitter & Reply",
  ],
  UGC: ["UGC App Review (Bounty)", "UGC Product Review (Bounty)"],
  "Video Watch Time": [
    "Watch Video 3 Mins (Bounty)",
    "Watch Video 6 Mins (Bounty)",
    "Watch Video 9 Mins (Bounty)",
    "Watch Video 20 Minutes (Bounty)",
    "Watch Video 3 Mins, Like, Share & Comment (Bounty)",
    "Watch Video 6 Mins, Like, Share & Comment (Bounty)",
    "Watch Video 9 Mins, Like, Share & Comment (Bounty)",
  ],
  Website: [
    "Visit Webpage Only",
    "Blog Visit, Comment & Share",
    "Website Visit & Search Keyword",
    "Website Visit, Search Keyword + Click",
    "Website Visit, Search Keyword + 2 Clicks",
    "Google Search Keyword + Visit Website",
  ],
  Whatsapp: ["Save Contact", "Follow Channel"],
  Youtube: [
    "Like",
    "Share",
    "Comment",
    "Like & Comment",
    "Like, Comment & Share",
    "Any 2 Video Task (Specify in Title)",
  ],
};
const categoryOptions = Object.keys(categoriesData);
const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
  "Central African Republic", "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", "Djibouti",
  "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana",
  "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
  "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
  "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
  "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
];
const CURRENCIES = ["NGN", "USD", "GBP", "EUR"];
const PLATFORM_FEE_PERCENT = 0.15;
const TINYMCE_API_KEY = "hibj0zuw254t339ddq36gppxwz01azujueckegndkz5ag3q4";



export default function NewCampaign() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ THEME PALETTE
  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      red: "#ff4500",
      input: isDark ? "#1c1c1e" : "#fff",
      hoverBg: isDark ? "#242b3d" : "#f2f6fd",
    }),
    [isDark]
  );

  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    jobDescription: "",
    instructions: "",
    country: "Nigeria",
    category: "",
    subCategory: "",
    workersNeeded: "",
    amountPerWorker: "",
    approvalDays: 3,
    jobsLink: "",
    approvalMode: "",
    file: null,
    reviewType: "Open",
    closedReviewOptions: "",
    rewardCurrency: "NGN",
    attachment: "",
    uploadingImage: false,
    is_screenshot_required: false,
  });
  

  
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [approvalModeSearch, setApprovalModeSearch] = useState("");
  const [showApprovalModeDropdown, setShowApprovalModeDropdown] = useState(false);
  
  const filteredCountries = africanCountries.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );
  
  const filteredCategories = categoryOptions.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );
  
  const approvalModes = ["Self Approval", "Platform Approval"];
  const filteredApprovalModes = approvalModes.filter(mode =>
    mode.toLowerCase().includes(approvalModeSearch.toLowerCase())
  );
  
  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowCountryDropdown(false);
      setShowCategoryDropdown(false);
      setShowApprovalModeDropdown(false);
    };
    if (showCountryDropdown || showCategoryDropdown || showApprovalModeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCountryDropdown, showCategoryDropdown, showApprovalModeDropdown]);

  const subCategoryList = form.category
    ? categoriesData[form.category] || []
    : [];
  const workersNeeded = parseInt(form.workersNeeded, 10) || 0;
  const amountPerWorker = parseFloat(form.amountPerWorker) || 0;
  const baseTotal = workersNeeded * amountPerWorker;
  const platformCharge = baseTotal * PLATFORM_FEE_PERCENT;
  const totalBudget = baseTotal + platformCharge;

  const isClosed = form.reviewType === "Closed";
  const closedOptions = (form.closedReviewOptions && typeof form.closedReviewOptions === 'string') 
    ? form.closedReviewOptions.split('\n').filter(Boolean) 
    : [];
  const closedOptionsCount = closedOptions.length;
  const hasClosedReviewContent = form.closedReviewOptions && typeof form.closedReviewOptions === 'string' && form.closedReviewOptions.trim().length > 0;
  const hasEnoughOptions = !isClosed || closedOptionsCount >= workersNeeded;

  React.useEffect(() => {
    if (!isClosed) {
      setForm((prev) => ({ ...prev, closedReviewOptions: "" }));
    }
  }, [form.reviewType]);

  const nextStep = () => {
    if (step === 1 && (!form.category || !form.subCategory)) {
      alert("Please select a job category and subcategory.");
      return;
    }
    if (step === 2) {
      if (!form.workersNeeded || workersNeeded < 10) {
        alert("Workers needed must be at least 10.");
        return;
      }
      if (!form.amountPerWorker || amountPerWorker < 50) {
        alert("Amount per worker must be at least 50.");
        return;
      }
      if (isClosed && !hasClosedReviewContent) {
        alert("Closed Review requires review options (either paste text or upload file).");
        return;
      }
      if (isClosed && closedOptionsCount < workersNeeded) {
        alert(`You need at least ${workersNeeded} options but only have ${closedOptionsCount}. Please add ${workersNeeded - closedOptionsCount} more options.`);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));





  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleBulkFile(file);
  };
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleBulkFile(file);
  };
  const handleBulkFile = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      let lines;
      
      if (file.name.endsWith(".csv")) {
        Papa.parse(text, {
          complete: function (result) {
            lines = result.data
              .flat()
              .map((l) => l.trim())
              .filter((l) => l);
            finalizeBulk(lines);
          },
          skipEmptyLines: true,
        });
      } else {
        lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l);
        finalizeBulk(lines);
      }
    };
    reader.readAsText(file);
  };
  const finalizeBulk = (lines) => {
    if (!Array.isArray(lines) || lines.length === 0) {
      setBulkStatus("bad");
      alert(`No valid options found in file.`);
      setTimeout(() => setBulkStatus(null), 3000);
      return;
    }
    setForm((prev) => ({
      ...prev,
      closedReviewOptions: lines.join('\n'),
    }));
    setBulkStatus("good");
    setTimeout(() => setBulkStatus(null), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setForm((prev) => ({ ...prev, uploadingImage: true }));
    try {
      const res = await uploadFile(file);
      const imgUrl = res.data?.data?.[0]?.src;
      setForm((prev) => ({
        ...prev,
        file,
        attachment: imgUrl,
        uploadingImage: false,
      }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } catch {
      setForm((prev) => ({ ...prev, uploadingImage: false }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    let attachmentUrl = form.attachment || "";
    let closed_review_options = null;

    if (form.reviewType === "Closed") {
      closed_review_options = (form.closedReviewOptions && typeof form.closedReviewOptions === 'string')
        ? form.closedReviewOptions.split('\n').map(l => l.trim()).filter(l => l)
        : [];
      if (!closed_review_options.length) {
        alert("Closed Review requires review options.");
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      title: form.title,
      is_screenshot_required: true,
      description: form.jobDescription,
      category: form.category,
      sub_category: form.subCategory,
      instructions: form.instructions,
      country: form.country,
      review_type: form.reviewType,
      closed_review_options,
      reward: {
        currency: form.rewardCurrency,
        amount: Number(totalBudget),
        amount_per_worker: Number(form.amountPerWorker),
      },
      slots: { max: Number(form.workersNeeded) },
      approval: {
        num_days: Number(form.approvalDays),
        mode: form.approvalMode === "Self Approval" ? "Self" : "Platform",
      },
      task_site: form.jobsLink || "",
    };
    
    // Only include attachment if file was uploaded
    if (attachmentUrl) {
      payload.attachment = attachmentUrl;
    }
    
    console.log('=== CREATE CAMPAIGN PAYLOAD ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('=== END PAYLOAD ===');
    
    try {
      await advertiserCreateTask(payload);
      alert("Campaign submitted!");
      window.location.reload();
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.text,
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "bold",
              color: palette.red,
              marginBottom: "12px",
            }}
          >
            <i
              className="bi bi-plus-circle"
              style={{ marginRight: "12px" }}
            ></i>
            Create New Campaign
          </h1>
          <p style={{ color: palette.label, fontSize: "1.05rem" }}>
            Fill in the details step by step to launch your campaign
          </p>
        </div>

        {/* Main Card */}
        <Card
          style={{
            background: palette.cardBg,
            border: `1px solid ${palette.border}`,
            borderRadius: "16px",
            boxShadow: isDark
              ? "0 4px 12px rgba(0,0,0,0.3)"
              : "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >
          <Card.Body style={{ padding: "40px" }}>
            <Form onSubmit={handleSubmit}>
              {/* ====== Step 1 ====== */}
              {step === 1 && (
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "12px",
                        }}
                      >
                        Country
                      </Form.Label>
                      <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                        <Form.Control
                          type="text"
                          placeholder="Search and select country"
                          value={countrySearch || form.country}
                          onChange={(e) => {
                            setCountrySearch(e.target.value);
                            setShowCountryDropdown(true);
                          }}
                          onFocus={() => setShowCountryDropdown(true)}
                          style={{
                            color: palette.text,
                            background: palette.input,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "8px",
                            padding: "10px 12px",
                          }}
                        />
                        {showCountryDropdown && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              background: palette.cardBg,
                              border: `1px solid ${palette.border}`,
                              borderRadius: "8px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              zIndex: 1000,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          >
                            {filteredCountries.map((country) => (
                              <div
                                key={country}
                                style={{
                                  padding: "10px 12px",
                                  cursor: "pointer",
                                  borderBottom: `1px solid ${palette.border}`,
                                  color: palette.text,
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = palette.hoverBg;
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = "transparent";
                                }}
                                onClick={() => {
                                  setForm((f) => ({ ...f, country }));
                                  setCountrySearch("");
                                  setShowCountryDropdown(false);
                                }}
                              >
                                {country}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "12px",
                        }}
                      >
                        Job Category
                      </Form.Label>
                      <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                        <Form.Control
                          type="text"
                          placeholder="Search and select category"
                          value={categorySearch || form.category}
                          onChange={(e) => {
                            setCategorySearch(e.target.value);
                            setShowCategoryDropdown(true);
                          }}
                          onFocus={() => setShowCategoryDropdown(true)}
                          style={{
                            color: palette.text,
                            background: palette.input,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "8px",
                            padding: "10px 12px",
                          }}
                        />
                        {showCategoryDropdown && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              background: palette.cardBg,
                              border: `1px solid ${palette.border}`,
                              borderRadius: "8px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              zIndex: 1000,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          >
                            {filteredCategories.map((category) => (
                              <div
                                key={category}
                                style={{
                                  padding: "10px 12px",
                                  cursor: "pointer",
                                  borderBottom: `1px solid ${palette.border}`,
                                  color: palette.text,
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = palette.hoverBg;
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = "transparent";
                                }}
                                onClick={() => {
                                  setForm((f) => ({ ...f, category, subCategory: "" }));
                                  setCategorySearch("");
                                  setShowCategoryDropdown(false);
                                }}
                              >
                                {category}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  {form.category && subCategoryList.length > 0 && (
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label
                          style={{
                            fontWeight: "600",
                            color: palette.text,
                            marginBottom: "12px",
                          }}
                        >
                          Sub Category
                        </Form.Label>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {subCategoryList.map((sub) => (
                            <Badge
                              key={sub}
                              pill
                              style={{
                                background:
                                  form.subCategory === sub
                                    ? palette.red
                                    : palette.hoverBg,
                                color:
                                  form.subCategory === sub
                                    ? "#fff"
                                    : palette.text,
                                padding: "8px 16px",
                                fontSize: "0.9rem",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                border: `1px solid ${palette.border}`,
                              }}
                              onClick={() =>
                                setForm((f) => ({
                                  ...f,
                                  subCategory: sub,
                                }))
                              }
                            >
                              {sub}
                            </Badge>
                          ))}
                        </div>
                        {form.subCategory && (
                          <small
                            style={{
                              display: "block",
                              marginTop: "12px",
                              color: palette.red,
                              fontWeight: "600",
                            }}
                          >
                            ✓ Selected: {form.subCategory}
                          </small>
                        )}
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "24px",
                        gap: "12px",
                      }}
                    >
                      <Button
                        style={{
                          background: palette.red,
                          border: "none",
                          padding: "12px 28px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          cursor:
                            !form.category || !form.subCategory
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            !form.category || !form.subCategory ? 0.5 : 1,
                        }}
                        disabled={!form.category || !form.subCategory}
                        onClick={nextStep}
                      >
                        Next{" "}
                        <ChevronRight size={18} style={{ marginLeft: "8px" }} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

              {/* ====== Step 2 ====== */}
              {step === 2 && (
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Workers Needed (Min: 10)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={10}
                        name="workersNeeded"
                        value={form.workersNeeded}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            workersNeeded: e.target.value,
                          }))
                        }
                        onBlur={(e) => {
                          const value = Math.max(10, parseInt(e.target.value) || 10);
                          setForm((f) => ({
                            ...f,
                            workersNeeded: value.toString(),
                          }));
                        }}
                        required
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Amount per Worker (Min: 50)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={50}
                        step="0.01"
                        name="amountPerWorker"
                        value={form.amountPerWorker}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            amountPerWorker: e.target.value,
                          }))
                        }
                        onBlur={(e) => {
                          const value = Math.max(50, parseFloat(e.target.value) || 50);
                          setForm((f) => ({
                            ...f,
                            amountPerWorker: value.toString(),
                          }));
                        }}
                        required
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "16px",
                          display: "block",
                        }}
                      >
                        Review Type
                      </Form.Label>
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          marginBottom: "20px",
                        }}
                      >
                        {["Open", "Closed"].map((type) => (
                          <label
                            key={type}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              cursor: "pointer",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: `2px solid ${
                                form.reviewType === type
                                  ? palette.red
                                  : palette.border
                              }`,
                              background:
                                form.reviewType === type
                                  ? `${palette.red}20`
                                  : palette.input,
                              transition: "all 0.2s",
                            }}
                          >
                            <input
                              type="radio"
                              name="reviewType"
                              value={type}
                              checked={form.reviewType === type}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  reviewType: e.target.value,
                                  ...(e.target.value === "Closed"
                                    ? { closedReviewOptions: [""] }
                                    : { reviewText: [""] }),
                                }))
                              }
                              style={{ cursor: "pointer" }}
                            />
                            <span
                              style={{
                                fontWeight: "500",
                                color: palette.text,
                              }}
                            >
                              {type === "Open" ? (
                                <FileText
                                  size={18}
                                  style={{
                                    display: "inline",
                                    marginRight: "8px",
                                  }}
                                />
                              ) : (
                                <ImageIcon
                                  size={18}
                                  style={{
                                    display: "inline",
                                    marginRight: "8px",
                                  }}
                                />
                              )}
                              {type} Review
                            </span>
                          </label>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>



                  {isClosed && (
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label
                          style={{
                            fontWeight: "600",
                            color: palette.text,
                            marginBottom: "12px",
                          }}
                        >
                          Closed Review Options
                        </Form.Label>
                        <Alert
                          style={{
                            background: palette.hoverBg,
                            color: palette.text,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "8px",
                          }}
                        >
                          <strong>
                            Paste bulk review options as lines (TXT) - must have at least {workersNeeded}{" "}
                            options.
                          </strong>
                        </Alert>

                        <div
                          style={{
                            border: `2px dashed ${
                              isDragging ? palette.red : palette.border
                            }`,
                            borderRadius: "12px",
                            padding: "24px",
                            textAlign: "center",
                            marginBottom: "16px",
                            background: isDragging
                              ? `${palette.red}10`
                              : palette.input,
                            transition: "all 0.2s",
                            cursor: "pointer",
                          }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <Upload
                            size={32}
                            style={{
                              marginBottom: "12px",
                              color: palette.red,
                            }}
                          />
                          <p
                            style={{
                              fontWeight: "600",
                              color: palette.text,
                              margin: "12px 0",
                            }}
                          >
                            Drop any file here
                          </p>
                          <input
                            type="file"
                            onChange={handleFileInput}
                            style={{ display: "none" }}
                            id="bulk-upload"
                          />
                          <label
                            htmlFor="bulk-upload"
                            style={{
                              display: "inline-block",
                              background: palette.red,
                              color: "#fff",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              marginTop: "12px",
                            }}
                          >
                            Choose File
                          </label>
                        </div>

                        {bulkStatus === "good" && (
                          <Alert
                            style={{
                              background: "#d4edda",
                              color: "#155724",
                              border: "1px solid #c3e6cb",
                              borderRadius: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            ✓ File content loaded into text area!
                          </Alert>
                        )}
                        {bulkStatus === "bad" && (
                          <Alert
                            style={{
                              background: "#f8d7da",
                              color: "#721c24",
                              border: "1px solid #f5c6cb",
                              borderRadius: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            ✗ Invalid or not enough review options!
                          </Alert>
                        )}

                        <Form.Control
                          as="textarea"
                          rows={8}
                          value={form.closedReviewOptions}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              closedReviewOptions: e.target.value,
                            }))
                          }
                          placeholder="Paste your review options here, one per line..."
                          style={{
                            color: palette.text,
                            background: palette.input,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "8px",
                            marginBottom: "12px",
                          }}
                        />
                        {!hasClosedReviewContent && (
                          <Alert
                            style={{
                              background: "#fff3cd",
                              color: "#856404",
                              border: "1px solid #ffeaa7",
                              borderRadius: "8px",
                              marginTop: "12px",
                            }}
                          >
                            Please provide review options by pasting text or uploading a file.
                          </Alert>
                        )}
                        {hasClosedReviewContent && !hasEnoughOptions && (
                          <Alert
                            style={{
                              background: "#f8d7da",
                              color: "#721c24",
                              border: "1px solid #f5c6cb",
                              borderRadius: "8px",
                              marginTop: "12px",
                            }}
                          >
                            Need {workersNeeded} options but only have {closedOptionsCount}. Add {workersNeeded - closedOptionsCount} more options.
                          </Alert>
                        )}
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "24px",
                        gap: "12px",
                      }}
                    >
                      <Button
                        style={{
                          background: palette.label,
                          color: "#fff",
                          border: "none",
                          padding: "10px 24px",
                          fontWeight: "600",
                          borderRadius: "8px",
                        }}
                        onClick={prevStep}
                      >
                        <ChevronLeft size={18} style={{ marginRight: "8px" }} />
                        Back
                      </Button>
                      <Button
                        style={{
                          background: palette.red,
                          color: "#fff",
                          border: "none",
                          padding: "10px 24px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          cursor:
                            (!form.workersNeeded || workersNeeded < 10 || !form.amountPerWorker || amountPerWorker < 50 || (isClosed && (!hasClosedReviewContent || !hasEnoughOptions)))
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            (!form.workersNeeded || workersNeeded < 10 || !form.amountPerWorker || amountPerWorker < 50 || (isClosed && (!hasClosedReviewContent || !hasEnoughOptions))) ? 0.5 : 1,
                        }}
                        onClick={nextStep}
                        disabled={!form.workersNeeded || workersNeeded < 10 || !form.amountPerWorker || amountPerWorker < 50 || (isClosed && (!hasClosedReviewContent || !hasEnoughOptions))}
                      >
                        Next{" "}
                        <ChevronRight size={18} style={{ marginLeft: "8px" }} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}

              {/* ====== Step 3 ====== */}
              {step === 3 && (
                <Row className="g-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Job Title
                      </Form.Label>
                      <Form.Control
                        name="title"
                        value={form.title}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        placeholder="e.g. App Rating Campaign"
                        required
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Job Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={form.jobDescription}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            jobDescription: e.target.value,
                          }))
                        }
                        placeholder="Describe the job requirements and what workers need to do..."
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Instructions
                      </Form.Label>
                      <Editor
                        apiKey={TINYMCE_API_KEY}
                        value={form.instructions}
                        onEditorChange={(content) =>
                          setForm((f) => ({
                            ...f,
                            instructions: content,
                          }))
                        }
                        init={{
                          height: 250,
                          menubar: false,
                          plugins: "lists link",
                          toolbar:
                            "bold italic underline | bullist numlist | outdent indent | link removeformat",
                          branding: false,
                          skin: isDark ? "oxide-dark" : "oxide",
                          content_css: isDark ? "dark" : "light",
                          setup: (editor) => {
                            editor.on('change', () => {
                              const content = editor.getContent();
                              setForm((f) => ({ ...f, instructions: content }));
                            });
                          }
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Approval Days (Max: 5)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        max={5}
                        name="approvalDays"
                        value={form.approvalDays}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            approvalDays: e.target.value,
                          }))
                        }
                        onBlur={(e) => {
                          const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
                          setForm((f) => ({
                            ...f,
                            approvalDays: value,
                          }));
                        }}
                        required
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                      <small style={{ color: palette.label, marginTop: "4px", display: "block" }}>
                        If approval is not made within 5 days, an approval would be automatically made for you.
                      </small>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Approval Mode
                      </Form.Label>
                      <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                        <Form.Control
                          type="text"
                          placeholder="Search and select approval mode"
                          value={approvalModeSearch || form.approvalMode}
                          onChange={(e) => {
                            setApprovalModeSearch(e.target.value);
                            setShowApprovalModeDropdown(true);
                          }}
                          onFocus={() => setShowApprovalModeDropdown(true)}
                          style={{
                            color: palette.text,
                            background: palette.input,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "8px",
                            padding: "10px 12px",
                          }}
                        />
                        {showApprovalModeDropdown && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              background: palette.cardBg,
                              border: `1px solid ${palette.border}`,
                              borderRadius: "8px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              zIndex: 1000,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          >
                            {filteredApprovalModes.map((mode) => (
                              <div
                                key={mode}
                                style={{
                                  padding: "10px 12px",
                                  cursor: "pointer",
                                  borderBottom: `1px solid ${palette.border}`,
                                  color: palette.text,
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.background = palette.hoverBg;
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.background = "transparent";
                                }}
                                onClick={() => {
                                  setForm((f) => ({ ...f, approvalMode: mode }));
                                  setApprovalModeSearch("");
                                  setShowApprovalModeDropdown(false);
                                }}
                              >
                                {mode}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Job Screenshot Sample (Optional)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageUpload}
                        disabled={form.uploadingImage}
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                      {fileName && (
                        <small
                          style={{
                            display: "block",
                            marginTop: "8px",
                            color: palette.label,
                          }}
                        >
                          {fileName}
                        </small>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Job Link
                      </Form.Label>
                      <Form.Control
                        name="jobsLink"
                        value={form.jobsLink}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            jobsLink: e.target.value,
                          }))
                        }
                        placeholder="https://example.com"
                        type="url"
                        required
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      />
                    </Form.Group>
                  </Col>

                  {imagePreview && (
                    <Col md={12}>
                      <Card
                        style={{
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                        }}
                      >
                        <Card.Body>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                            }}
                          >
                            <small
                              style={{
                                fontWeight: "600",
                                color: palette.red,
                              }}
                            >
                              Screenshot Preview
                            </small>
                            <Button
                              style={{
                                background: "none",
                                border: "none",
                                color: "#dc3545",
                                cursor: "pointer",
                                padding: 0,
                              }}
                              onClick={() => {
                                setImagePreview(null);
                                setFileName("");
                                setForm((f) => ({
                                  ...f,
                                  file: null,
                                  attachment: "",
                                }));
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          <img
                            src={imagePreview}
                            alt="Attachment preview"
                            style={{
                              maxHeight: "200px",
                              objectFit: "contain",
                              borderRadius: "8px",
                              width: "100%",
                            }}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  )}

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          fontWeight: "600",
                          color: palette.text,
                          marginBottom: "8px",
                        }}
                      >
                        Reward Currency
                      </Form.Label>
                      <Form.Select
                        name="rewardCurrency"
                        value={form.rewardCurrency}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            rewardCurrency: e.target.value,
                          }))
                        }
                        required
                        style={{
                          color: palette.text,
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      >
                        {CURRENCIES.map((cur) => (
                          <option key={cur} value={cur}>
                            {cur}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Payment Summary */}
                  <Col md={12}>
                    <Card
                      style={{
                        background: palette.input,
                        border: `1px solid ${palette.border}`,
                        borderRadius: "8px",
                        marginTop: "20px",
                      }}
                    >
                      <Card.Body>
                        <h5
                          style={{
                            marginBottom: "16px",
                            fontWeight: "bold",
                            color: palette.text,
                          }}
                        >
                          Payment Summary
                        </h5>
                        <Table
                          style={{
                            color: palette.text,
                            borderColor: palette.border,
                            marginBottom: 0,
                          }}
                        >
                          <tbody>
                            <tr style={{ borderBottomColor: palette.border }}>
                              <td>Workers Needed</td>
                              <td>{workersNeeded}</td>
                            </tr>
                            <tr style={{ borderBottomColor: palette.border }}>
                              <td>Amount Per Worker</td>
                              <td>
                                {form.rewardCurrency}{" "}
                                {amountPerWorker.toLocaleString()}
                              </td>
                            </tr>
                            <tr style={{ borderBottomColor: palette.border }}>
                              <td>
                                Platform Fee ({PLATFORM_FEE_PERCENT * 100}%)
                              </td>
                              <td>
                                {form.rewardCurrency}{" "}
                                {platformCharge.toLocaleString()}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Total Amount</strong>
                              </td>
                              <td>
                                <strong>
                                  {form.rewardCurrency}{" "}
                                  {totalBudget.toLocaleString()}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Buttons */}
                  <Col md={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "24px",
                        gap: "12px",
                      }}
                    >
                      <Button
                        style={{
                          background: palette.label,
                          color: "#fff",
                          border: "none",
                          padding: "10px 24px",
                          fontWeight: "600",
                          borderRadius: "8px",
                        }}
                        onClick={prevStep}
                      >
                        <ChevronLeft size={18} style={{ marginRight: "8px" }} />
                        Back
                      </Button>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                          style={{
                            background: palette.input,
                            color: palette.text,
                            border: `2px solid ${palette.border}`,
                            padding: "10px 24px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => setShowPreview(true)}
                        >
                          Preview
                        </Button>
                        <Button
                          type="submit"
                          style={{
                            background: palette.red,
                            color: "#fff",
                            border: "none",
                            padding: "10px 24px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            cursor:
                              submitting || form.uploadingImage
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              submitting || form.uploadingImage ? 0.6 : 1,
                          }}
                          disabled={submitting || form.uploadingImage}
                        >
                          {submitting || form.uploadingImage ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                style={{ marginRight: "8px" }}
                              />
                              Posting...
                            </>
                          ) : (
                            "Post Campaign"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </Card.Body>
        </Card>

        {/* Preview Modal */}
        <Modal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          size="lg"
          centered
        >
          <Modal.Header
            style={{
              background: palette.cardBg,
              borderColor: palette.border,
              color: palette.text,
            }}
            closeButton
          >
            <Modal.Title style={{ fontWeight: "bold" }}>
              Campaign Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background: palette.cardBg,
              color: palette.text,
            }}
          >
            <h5 style={{ fontWeight: "bold", marginBottom: "12px" }}>
              {form.title || "Untitled Campaign"}
            </h5>
            <p
              style={{
                fontSize: "0.9rem",
                color: palette.label,
                marginBottom: "12px",
              }}
            >
              {form.category} • {form.subCategory} • {form.country}
            </p>
            <Badge
              style={{
                background: palette.red,
                color: "#fff",
                padding: "8px 12px",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              {form.rewardCurrency} {totalBudget.toLocaleString()}
            </Badge>
            <div style={{ marginTop: "20px" }}>
              <strong>Description</strong>
              <p style={{ marginTop: "8px", color: palette.label, whiteSpace: "pre-wrap" }}>
                {form.jobDescription}
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
              <strong>Instructions</strong>
              <div
                dangerouslySetInnerHTML={{ __html: form.instructions }}
                style={{ marginTop: "8px", color: palette.label }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer
            style={{
              background: palette.cardBg,
              borderColor: palette.border,
            }}
          >
            <Button
              style={{
                background: palette.label,
                color: "#fff",
                border: "none",
              }}
              onClick={() => setShowPreview(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
