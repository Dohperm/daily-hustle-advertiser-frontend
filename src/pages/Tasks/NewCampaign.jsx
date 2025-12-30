import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useSearchParams } from "react-router-dom";
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
import { toast } from "react-toastify";

// Campaign types data from CampaignTypes.jsx
const campaignTypesData = [
  {
    job_title: "Affiliate Referral Task",
    job_category: "Affiliate Rewards",
    sub_job_category: "Referral Tasks",
    job_description: "Refer users, products or services",
    job_instructions: "Share referral links; track signups",
    amount: "₦25,000",
    min_duration: "1 day",
    complexity_rating: "Very Hard"
  },
  {
    job_title: "App Installation Task",
    job_category: "App Download",
    sub_job_category: "Install Tasks",
    job_description: "Download and install apps",
    job_instructions: "Install app & take screenshot as proof",
    amount: "₦150",
    min_duration: "2–5 mins",
    complexity_rating: "High"
  },
  {
    job_title: "Artist Engagement Task",
    job_category: "Artist Engagement",
    sub_job_category: "Music Promotion",
    job_description: "Engage with music artists",
    job_instructions: "Follow artists and interact on social media",
    amount: "₦45",
    min_duration: "1–2 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "Content Interaction Task",
    job_category: "Content Rewards",
    sub_job_category: "Content Interaction",
    job_description: "Like, comment, share content",
    job_instructions: "Interact with content posted by clients",
    amount: "₦35",
    min_duration: "1–3 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "Discord Join Task",
    job_category: "Discord",
    sub_job_category: "Community Join",
    job_description: "Join Discord server & interact",
    job_instructions: "Join server & perform reactions / message",
    amount: "₦50",
    min_duration: "2–3 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "Facebook Engagement Task",
    job_category: "Facebook",
    sub_job_category: "Page/Group/Engage",
    job_description: "Follow, like, comment, join group",
    job_instructions: "Like pages, join groups, comment on posts",
    amount: "₦12",
    min_duration: "1 min",
    complexity_rating: "Easy"
  },
  {
    job_title: "Instagram Engagement Task",
    job_category: "Instagram",
    sub_job_category: "Follow/Engage",
    job_description: "Follow pages, like posts",
    job_instructions: "Follow IG accounts, like posts, comment",
    amount: "₦15",
    min_duration: "1 min",
    complexity_rating: "Easy"
  },
  {
    job_title: "LinkedIn Professional Task",
    job_category: "LinkedIn",
    sub_job_category: "Professional Engage",
    job_description: "Follow companies, like/comment",
    job_instructions: "Follow business pages & engage posts",
    amount: "₦20",
    min_duration: "1–2 mins",
    complexity_rating: "Medium"
  },
  {
    job_title: "Online Voting Task",
    job_category: "Online Vote",
    sub_job_category: "Voting Tasks",
    job_description: "Vote in polls or contests",
    job_instructions: "Cast vote online as instructed",
    amount: "₦45",
    min_duration: "1–3 mins",
    complexity_rating: "Medium"
  },
  {
    job_title: "Review Task",
    job_category: "Review",
    sub_job_category: "App/Product/Website",
    job_description: "Write reviews for apps, websites",
    job_instructions: "Write honest reviews on platform",
    amount: "₦125",
    min_duration: "3–5 mins",
    complexity_rating: "Medium"
  },
  {
    job_title: "Registration Task",
    job_category: "Sign Up",
    sub_job_category: "Registration Tasks",
    job_description: "Website or app registration",
    job_instructions: "Register account; complete optional KYC",
    amount: "₦175",
    min_duration: "2–5 mins",
    complexity_rating: "Medium/High"
  },
  {
    job_title: "Snapchat Engagement Task",
    job_category: "Snapchat",
    sub_job_category: "Add/Engage",
    job_description: "Add accounts, view stories",
    job_instructions: "Add user & interact with content",
    amount: "₦35",
    min_duration: "1 min",
    complexity_rating: "Easy"
  },
  {
    job_title: "Music Streaming Task",
    job_category: "Stream Music",
    sub_job_category: "Music Streaming",
    job_description: "Stream music on platforms",
    job_instructions: "Stream tracks & share proof if required",
    amount: "₦30",
    min_duration: "2–10 mins",
    complexity_rating: "Medium"
  },
  {
    job_title: "Survey Task",
    job_category: "Survey",
    sub_job_category: "Opinion/Research",
    job_description: "Complete survey forms",
    job_instructions: "Answer survey questions fully",
    amount: "₦95",
    min_duration: "3–10 mins",
    complexity_rating: "Medium"
  },
  {
    job_title: "Telegram Engagement Task",
    job_category: "Telegram",
    sub_job_category: "Join/Engage",
    job_description: "Join groups/channels",
    job_instructions: "Join group/channel & react or comment",
    amount: "₦27",
    min_duration: "1–3 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "Threads Engagement Task",
    job_category: "Threads",
    sub_job_category: "Social Threads Engage",
    job_description: "Engage on Threads",
    job_instructions: "Comment, like, follow posts",
    amount: "₦35",
    min_duration: "1–2 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "TikTok Engagement Task",
    job_category: "Tiktok",
    sub_job_category: "Follow/Engage/Video",
    job_description: "Like, follow, comment, or create video",
    job_instructions: "Engage with TikTok content",
    amount: "₦17",
    min_duration: "1–5 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "Twitter Engagement Task",
    job_category: "Twitter [X]",
    sub_job_category: "Likes/Retweets/Follow",
    job_description: "Interact with posts or accounts",
    job_instructions: "Like, retweet, or follow",
    amount: "₦15",
    min_duration: "1–2 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "UGC Creation Task",
    job_category: "UGC",
    sub_job_category: "User-Generated Content",
    job_description: "Create videos/photos",
    job_instructions: "Record content for brand promotion",
    amount: "₦1,500",
    min_duration: "10–20 mins",
    complexity_rating: "Hard"
  },
  {
    job_title: "Website Interaction Task",
    job_category: "Website",
    sub_job_category: "Visit website & click links",
    job_description: "Open page & interact as instructed",
    job_instructions: "Open website, click specified links, confirm completion",
    amount: "₦35",
    min_duration: "1–2 mins",
    complexity_rating: "Easy"
  },
  {
    job_title: "WhatsApp Engagement Task",
    job_category: "Whatsapp",
    sub_job_category: "Join groups, repost status",
    job_description: "Join group & share content",
    job_instructions: "Join group, repost status, confirm completion",
    amount: "₦20",
    min_duration: "1 min",
    complexity_rating: "Easy"
  },
  {
    job_title: "YouTube Engagement Task",
    job_category: "Youtube",
    sub_job_category: "Subscribe, watch, comment",
    job_description: "Subscribe & interact with content",
    job_instructions: "Subscribe, watch, and comment on videos",
    amount: "₦17",
    min_duration: "1–5 mins",
    complexity_rating: "Easy"
  }
];

// Comprehensive categories data from AllCampaigns
const categoriesData = {
  "Affiliate Rewards": [
    "Top of Form",
    "Mobile App Invites",
    "Course Sale",
    "Software Sales",
    "Cashback Sale",
  ],
  "App Download": [
    "Mobile Gameplay",
    "Blogpost App Review",
    "Mobile App Download",
    "Sign Up & Review",
    "Mobile App Download & Sign Up + Deposit",
    "Mobile App Download, KYC Sign Up & Additional Task",
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
    "UGC Content",
    "Reaction Video",
    "Fanpage With 10 Posts",
    "Fanpage With 50 Posts",
    "Fanpage With 100 Posts",
    "Create a Meme Series (10 Slides)",
    "Public Reaction (Street Interview)",
    "Behind-the-Scenes or Explainer Edit",
    "UGC Content with 10K Views",
    "UGC Content with 50K Views",
    "UGC Content with 100K+ Views",
  ],
  "Discord": ["Like/React", "Join Server", "Join Channel"],
  "Facebook": [
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
  "Instagram": [
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
    "Watch Video & Comment",
    "Like, Comment & Comment Likes + Reply",
  ],
  "LinkedIn": [
    "Like",
    "Repost",
    "Connect",
    "Comment",
    "Follow & Like",
    "Follow, Like & Comment",
  ],
  "Online Vote": [
    "Website Vote",
    "Facebook Vote",
    "Sign Up & Vote",
    "Instagram Post Vote",
    "Vote & Email Confirmation",
    "Paid Vote",
    "Vote Via SMS",
    "Complex Vote (Multiple Survey, Email, Phone Verification)",
  ],
  "Review": [
    "Facebook Page",
    "Google Review",
    "Facebook Review",
    "Trust Pilot Review",
  ],
  "Sign Up": [
    "Forum Sign Up",
    "Quick Email Sign Up",
    "Sign Up & Submit KYC",
    "Detailed Sign Up",
    "Sign Up + Additional Task",
    "Sign Up + Deposit",
    "Verify Email & Mobile Number",
  ],
  "Snapchat": ["View All Story (Public Only)", "Snapchat Follow/Subscribe"],
  "Stream Music": [
    "Stream on Boomplay & Share",
    "Stream Music on Spotify & Share",
    "Stream Music on Apple Music & Share",
    "Stream on AudioMack & Share",
    "Stream on YouTube Music & Share",
    "Stream Music on Tidal & Share",
    "Stream on Deezer & Share",
  ],
  "Survey": [
    "10 Questions",
    "20 Questions",
    "30 Questions",
  ],
  "Telegram": ["Bot Join", "Group Join", "Simple Air Drop", "Complex Air Drop"],
  "Threads": ["Like", "Quote", "Follow", "Repost", "Comment", "Like & Comment"],
  "Tiktok": [
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
  "UGC": ["UGC App Review", "UGC Product Review"],
  "Video Watch Time": [
    "Watch Video 3 Mins",
    "Watch Video 6 Mins",
    "Watch Video 9 Mins",
    "Watch Video 20 Minutes",
    "Watch Video 3 Mins, Like, Share & Comment",
    "Watch Video 6 Mins, Like, Share & Comment",
    "Watch Video 9 Mins, Like, Share & Comment",
  ],
  "Website": [
    "Visit Webpage Only",
    "Blog Visit, Comment & Share",
    "Website Visit & Search Keyword",
    "Website Visit, Search Keyword + Click",
    "Website Visit, Search Keyword + 2 Clicks",
    "Google Search Keyword + Visit Website",
  ],
  "Whatsapp": ["Save Contact", "Follow Channel"],
  "Youtube": [
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
  const [searchParams] = useSearchParams();

  // ✅ THEME PALETTE
  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      red: "#e53e3e",
      input: isDark ? "#1c1c1e" : "#fff",
      hoverBg: isDark ? "#242b3d" : "#f2f6fd",
    }),
    [isDark]
  );

  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('campaignDraft');
    const selectedType = localStorage.getItem('selectedCampaignType');
    
    let initialForm = {
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
      attachment: [],
      uploadingImage: false,
      is_screenshot_required: false,
      minDuration: "",
      complexityRating: "",
      fromCampaignType: false,
    };
    
    // Check URL parameters first
    const urlTitle = searchParams.get('title');
    const urlCategory = searchParams.get('category');
    const urlSubcategory = searchParams.get('subcategory');
    const urlDescription = searchParams.get('description');
    const urlInstructions = searchParams.get('instructions');
    const urlAmount = searchParams.get('amount');
    const urlDuration = searchParams.get('duration');
    const urlComplexity = searchParams.get('complexity');
    
    if (urlTitle || urlCategory) {
      initialForm = {
        ...initialForm,
        title: urlTitle || "",
        category: urlCategory || "",
        subCategory: urlSubcategory || "",
        jobDescription: urlDescription || "",
        instructions: urlInstructions || "",
        minDuration: urlDuration || "",
        complexityRating: urlComplexity || "",
        amountPerWorker: urlAmount ? urlAmount.replace(/[^0-9.]/g, '') : "",
        fromCampaignType: true,
      };
    } else if (saved) {
      initialForm = JSON.parse(saved);
    } else if (selectedType) {
      // Prefill from selected campaign type
      const typeData = JSON.parse(selectedType);
      initialForm = {
        ...initialForm,
        title: typeData.jobTitle || "",
        category: typeData.category,
        subCategory: typeData.subCategory,
        jobDescription: typeData.jobDescription,
        instructions: typeData.instructions,
        minDuration: typeData.minDuration,
        complexityRating: typeData.complexityRating,
        amountPerWorker: typeData.amount ? typeData.amount.replace('₦', '').replace(',', '') : "",
        fromCampaignType: true,
      };
      // Clear the selected type from localStorage
      localStorage.removeItem('selectedCampaignType');
    }
    
    return initialForm;
  });

  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [approvalModeSearch, setApprovalModeSearch] = useState("");
  const [showApprovalModeDropdown, setShowApprovalModeDropdown] = useState(false);

  // Save draft to localStorage whenever form changes
  React.useEffect(() => {
    localStorage.setItem('campaignDraft', JSON.stringify(form));
  }, [form]);
  
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
  
  const subCategoryList = form.category
    ? categoriesData[form.category] || []
    : [];
  const workersNeeded = parseInt(form.workersNeeded, 10) || 0;
  const amountPerWorker = parseFloat(form.amountPerWorker) || 0;
  const baseTotal = workersNeeded * amountPerWorker;
  const platformCharge = baseTotal * PLATFORM_FEE_PERCENT;
  const totalBudget = baseTotal + platformCharge;

  const isClosed = form.reviewType === "Closed";

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

  React.useEffect(() => {
    if (!isClosed) {
      setForm((prev) => ({ ...prev, closedReviewOptions: "" }));
    }
  }, [isClosed]);
  const closedOptions = (form.closedReviewOptions && typeof form.closedReviewOptions === 'string') 
    ? form.closedReviewOptions.split('\n').filter(Boolean) 
    : [];
  const closedOptionsCount = closedOptions.length;
  const hasClosedReviewContent = form.closedReviewOptions && typeof form.closedReviewOptions === 'string' && form.closedReviewOptions.trim().length > 0;
  const hasEnoughOptions = !isClosed || closedOptionsCount >= workersNeeded;



  const nextStep = () => {
    if (step === 1 && (!form.category || !form.subCategory)) {
      toast.error("Please select a job category and subcategory.");
      return;
    }
    if (step === 2) {
      if (!form.workersNeeded || workersNeeded < 10) {
        toast.error("Workers needed must be at least 10.");
        return;
      }
      if (!form.amountPerWorker) {
        toast.error("Amount per worker is required.");
        return;
      }
      if (form.category === "Review" && isClosed && !hasClosedReviewContent) {
        toast.error("Closed Review requires review options (either paste text or upload file).");
        return;
      }
      if (form.category === "Review" && isClosed && closedOptionsCount < workersNeeded) {
        toast.error(`You need at least ${workersNeeded} options but only have ${closedOptionsCount}. Please add ${workersNeeded - closedOptionsCount} more options.`);
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
      toast.error(`No valid options found in file.`);
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
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setForm((prev) => ({ ...prev, uploadingImage: true }));
    
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const responses = await Promise.all(uploadPromises);
      
      const newUrls = responses.map(res => res.data?.data?.[0]?.src).filter(Boolean);
      const newNames = files.map(file => file.name);
      
      // Create preview URLs for images
      const newPreviews = await Promise.all(
        files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );
      
      setForm((prev) => ({
        ...prev,
        attachment: [...prev.attachment, ...newUrls],
        uploadingImage: false,
      }));
      
      setFileNames(prev => [...prev, ...newNames]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    } catch {
      setForm((prev) => ({ ...prev, uploadingImage: false }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    let closed_review_options = null;

    if (form.reviewType === "Closed") {
      closed_review_options = (form.closedReviewOptions && typeof form.closedReviewOptions === 'string')
        ? form.closedReviewOptions.split('\n').map(l => l.trim()).filter(l => l)
        : [];
      if (!closed_review_options.length) {
        toast.error("Closed Review requires review options.");
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
      reward: {
        currency: form.rewardCurrency,
        amount: Number(totalBudget),
        amount_per_worker: Number(form.amountPerWorker),
      },
      min_duration: form.minDuration,
      complexity_rating: form.complexityRating,
      slots: { max: Number(form.workersNeeded) },
      approval: {
        num_days: Number(form.approvalDays),
        mode: form.approvalMode === "Self Approval" ? "Self" : "Platform",
      },
      task_site: form.jobsLink || "",
    };
    
    // Only include review_type and closed_review_options for Review jobs
    if (form.category === "Review") {
      payload.review_type = form.reviewType;
      payload.closed_review_options = closed_review_options;
    }
    
    // Include attachment array if files were uploaded
    if (form.attachment.length > 0) {
      payload.attachment = form.attachment;
    }
    
    console.log('=== CREATE CAMPAIGN PAYLOAD ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('=== END PAYLOAD ===');
    
    try {
      await advertiserCreateTask(payload);
      localStorage.removeItem('campaignDraft');
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.message || err.message));
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
                        Amount per Worker
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="amountPerWorker"
                        value={form.amountPerWorker}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            amountPerWorker: e.target.value,
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
                        Min Duration
                      </Form.Label>
                      <Form.Select
                        name="minDuration"
                        value={form.minDuration}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            minDuration: e.target.value,
                          }))
                        }
                        disabled={form.fromCampaignType}
                        style={{
                          color: form.fromCampaignType ? palette.label : palette.text,
                          background: form.fromCampaignType ? palette.hoverBg : palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      >
                        <option value="">Select duration</option>
                        <option value="Less than 1 minute">Less than 1 minute</option>
                        <option value="1-5 minutes">1-5 minutes</option>
                        <option value="5-10 minutes">5-10 minutes</option>
                        <option value="10-30 minutes">10-30 minutes</option>
                        <option value="30-60 minutes">30-60 minutes</option>
                        <option value="More than 1 hour">More than 1 hour</option>
                      </Form.Select>
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
                        Complexity Rating
                      </Form.Label>
                      <Form.Select
                        name="complexityRating"
                        value={form.complexityRating}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            complexityRating: e.target.value,
                          }))
                        }
                        disabled={form.fromCampaignType}
                        style={{
                          color: form.fromCampaignType ? palette.label : palette.text,
                          background: form.fromCampaignType ? palette.hoverBg : palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "8px",
                          padding: "10px 12px",
                        }}
                      >
                        <option value="">Select complexity</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Very Hard">Very Hard</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {form.category === "Review" && (
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
                  )}



                  {form.category === "Review" && isClosed && (
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
                            Paste bulk review options - must have at least {workersNeeded} options.
                          </strong>
                          <br />
                          <small>Each line = one statement. For multi-line statements, use a single line without breaks.</small>
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
                            (!form.workersNeeded || workersNeeded < 10 || !form.amountPerWorker || (form.category === "Review" && isClosed && (!hasClosedReviewContent || !hasEnoughOptions)))
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            (!form.workersNeeded || workersNeeded < 10 || !form.amountPerWorker || (form.category === "Review" && isClosed && (!hasClosedReviewContent || !hasEnoughOptions))) ? 0.5 : 1,
                        }}
                        onClick={nextStep}
                        disabled={!form.workersNeeded || workersNeeded < 10 || !form.amountPerWorker || (form.category === "Review" && isClosed && (!hasClosedReviewContent || !hasEnoughOptions))}
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
                <>
                  <div className="d-flex justify-content-start mb-3">
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
                  </div>
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
                      <Editor
                        apiKey={TINYMCE_API_KEY}
                        value={form.jobDescription}
                        onEditorChange={(content) =>
                          setForm((f) => ({
                            ...f,
                            jobDescription: content,
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
                              setForm((f) => ({ ...f, jobDescription: content }));
                            });
                          }
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
                        Job Screenshot Sample(s) (Optional)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
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
                      {fileNames.length > 0 && (
                        <div style={{ marginTop: "8px" }}>
                          {fileNames.map((name, index) => (
                            <small
                              key={index}
                              style={{
                                display: "block",
                                color: palette.label,
                                marginBottom: "4px",
                              }}
                            >
                              {name}
                            </small>
                          ))}
                        </div>
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



                  {imagePreviews.length > 0 && (
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
                              Screenshot Previews ({imagePreviews.length})
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
                                setImagePreviews([]);
                                setFileNames([]);
                                setForm((f) => ({
                                  ...f,
                                  file: null,
                                  attachment: [],
                                }));
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            {imagePreviews.map((preview, index) => (
                              <div key={index} style={{ position: "relative" }}>
                                <img
                                  src={preview}
                                  alt={`Attachment ${index + 1}`}
                                  style={{
                                    maxHeight: "150px",
                                    maxWidth: "150px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    border: `1px solid ${palette.border}`,
                                  }}
                                />
                                <Button
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    background: "rgba(220, 53, 69, 0.8)",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() => {
                                    const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                    const newNames = fileNames.filter((_, i) => i !== index);
                                    const newAttachments = form.attachment.filter((_, i) => i !== index);
                                    
                                    setImagePreviews(newPreviews);
                                    setFileNames(newNames);
                                    setForm(f => ({ ...f, attachment: newAttachments }));
                                  }}
                                >
                                  <X size={12} color="white" />
                                </Button>
                              </div>
                            ))}
                          </div>
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
                </>  
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

        {/* Success Animation Modal */}
        <Modal
          show={showSuccess}
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body className="text-center py-5">
            <div
              style={{
                fontSize: "4rem",
                color: "#28a745",
                marginBottom: "20px",
                animation: "bounce 1s ease-in-out",
              }}
            >
              ✅
            </div>
            <h3 style={{ color: palette.text, marginBottom: "10px" }}>
              Campaign Submitted Successfully!
            </h3>
            <p style={{ color: palette.label }}>
              Your campaign is now live and workers can start applying.
            </p>
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "#e9ecef",
                borderRadius: "2px",
                marginTop: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, #28a745, #20c997)",
                  animation: "progress 2s ease-in-out",
                }}
              />
            </div>
          </Modal.Body>
        </Modal>

        <style>{`
          @keyframes bounce {
            0%, 20%, 60%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-30px);
            }
            80% {
              transform: translateY(-15px);
            }
          }
          @keyframes progress {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          ${isDark ? `
            input::placeholder,
            textarea::placeholder {
              color: #6c757d !important;
              opacity: 1;
            }
          ` : ''}
        `}</style>
      </div>
    </div>
  );
}
