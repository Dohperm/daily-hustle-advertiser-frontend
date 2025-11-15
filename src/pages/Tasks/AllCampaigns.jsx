import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useTheme } from "../../context/ThemeContext";

const CAMPAIGN_CATEGORIES = {
  "Affiliate Rewards": {
    icon: "bi-gift",
    items: [
      "Top of Form",
      "Mobile App Invites (Bounty)",
      "Course Sale (Bounty)",
      "Software Sales (Bounty)",
      "Cashback Sale (Bounty)",
    ],
  },
  "App Download": {
    icon: "bi-phone",
    items: [
      "Mobile Gameplay",
      "Blogpost App Review (Bounty)",
      "Mobile App Download",
      "Sign Up & Review (Bounty)",
      "Mobile App Download & Sign Up + Deposit (Bounty)",
      "Mobile App Download, KYC Sign Up & Additional Task (Bounty)",
    ],
  },
  "Artist Engagement": {
    icon: "bi-music-note-beamed",
    items: [
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
  },
  "Content Rewards": {
    icon: "bi-camera-video",
    items: [
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
  },
  Discord: {
    icon: "bi-discord",
    items: ["Like/React", "Join Server", "Join Channel"],
  },
  Facebook: {
    icon: "bi-facebook",
    items: [
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
  },
  Instagram: {
    icon: "bi-instagram",
    items: [
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
  },
  LinkedIn: {
    icon: "bi-linkedin",
    items: [
      "Like",
      "Repost",
      "Connect",
      "Comment",
      "Follow & Like",
      "Follow, Like & Comment",
    ],
  },
  "Online Vote": {
    icon: "bi-check2-square",
    items: [
      "Website Vote",
      "Facebook Vote",
      "Sign Up & Vote",
      "Instagram Post Vote",
      "Vote & Email Confirmation",
      "Paid Vote (Bounty)",
      "Vote Via SMS (Bounty)",
      "Complex Vote (Multiple Survey, Email, Phone Verification)",
    ],
  },
  Review: {
    icon: "bi-star-fill",
    items: [
      "Facebook Page",
      "Google Review",
      "Facebook Review",
      "Trust Pilot Review",
    ],
  },

  "Sign Up": {
    icon: "bi-person-plus",
    items: [
      "Forum Sign Up (Bounty)",
      "Quick Email Sign Up (Bounty)",
      "Sign Up & Submit KYC (Bounty)",
      "Detailed Sign Up (Bounty)",
      "Sign Up + Additional Task (Bounty)",
      "Sign Up + Deposit (Bounty)",
      "Verify Email & Mobile Number",
    ],
  },
  Snapchat: {
    icon: "bi-snapchat",
    items: ["View All Story (Public Only)", "Snapchat Follow/Subscribe"],
  },
  "Stream Music": {
    icon: "bi-play-circle",
    items: [
      "Stream on Boomplay & Share (Bounty)",
      "Stream Music on Spotify & Share (Bounty)",
      "Stream Music on Apple Music & Share (Bounty)",
      "Stream on AudioMack & Share (Bounty)",
      "Stream on YouTube Music & Share (Bounty)",
      "Stream Music on Tidal & Share (Bounty)",
      "Stream on Deezer & Share (Bounty)",
    ],
  },
  Survey: {
    icon: "bi-clipboard-check",
    items: [
      "10 Questions (Bounty)",
      "20 Questions (Bounty)",
      "30 Questions (Bounty)",
    ],
  },
  Telegram: {
    icon: "bi-telegram",
    items: ["Bot Join", "Group Join", "Simple Air Drop", "Complex Air Drop"],
  },
  Threads: {
    icon: "bi-chat-dots",
    items: ["Like", "Quote", "Follow", "Repost", "Comment", "Like & Comment"],
  },
  Tiktok: {
    icon: "bi-tiktok",
    items: [
      "Like",
      "Follow",
      "Comment",
      "Like & Share",
      "Like & Comment",
      "Follow, Like & Comment",
    ],
  },
  "Twitter [X]": {
    icon: "bi-twitter-x",
    items: [
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
  },
  UGC: {
    icon: "bi-file-earmark-play",
    items: ["UGC App Review (Bounty)", "UGC Product Review (Bounty)"],
  },
  "Video Watch Time": {
    icon: "bi-clock-history",
    items: [
      "Watch Video 3 Mins (Bounty)",
      "Watch Video 6 Mins (Bounty)",
      "Watch Video 9 Mins (Bounty)",
      "Watch Video 20 Minutes (Bounty)",
      "Watch Video 3 Mins, Like, Share & Comment (Bounty)",
      "Watch Video 6 Mins, Like, Share & Comment (Bounty)",
      "Watch Video 9 Mins, Like, Share & Comment (Bounty)",
    ],
  },
  Website: {
    icon: "bi-globe",
    items: [
      "Visit Webpage Only",
      "Blog Visit, Comment & Share",
      "Website Visit & Search Keyword",
      "Website Visit, Search Keyword + Click",
      "Website Visit, Search Keyword + 2 Clicks",
      "Google Search Keyword + Visit Website",
    ],
  },
  Whatsapp: {
    icon: "bi-whatsapp",
    items: ["Save Contact", "Follow Channel"],
  },
  Youtube: {
    icon: "bi-youtube",
    items: [
      "Like",
      "Share",
      "Comment",
      "Like & Comment",
      "Like, Comment & Share",
      "Any 2 Video Task (Specify in Title)",
    ],
  },
};

export default function AllCampaigns() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isDark = theme === "dark";
  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      border: isDark ? "#313843" : "#dee2e6",
      red: "#ff4500",
      primary: "#0d6efd",
    }),
    [isDark]
  );

  const categories = useMemo(() => Object.entries(CAMPAIGN_CATEGORIES), []);
  const filteredCategories = useMemo(
    () =>
      categories.filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, categories]
  );

  const openModal = (name) => {
    setSelectedCategory({ ...CAMPAIGN_CATEGORIES[name], name });
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    document.body.style.overflow = "auto";
  };

  React.useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  return (
    <>
      {/* Header */}
      <section
        style={{
          background: palette.bg,
          color: palette.text,
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <div className="container">
          {/* Title Section */}
          <div className="text-center mb-5">
            <h1
              className="fw-bold mb-2"
              style={{
                fontSize: "2.5rem",
                color: palette.text,
                letterSpacing: "0.5px",
              }}
            >
              <i
                className="bi bi-megaphone me-3"
                style={{ color: palette.red, fontSize: "2rem" }}
              ></i>
              Campaign Types
            </h1>
            <p style={{ color: palette.label, fontSize: "1.05rem" }}>
              Explore all available tasks and categories to start earning
            </p>
          </div>

          {/* Search Field */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-md-8 col-lg-6">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: palette.cardBg,
                  border: `2px solid ${palette.border}`,
                  borderRadius: "12px",
                  padding: "12px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = palette.red;
                  e.currentTarget.style.boxShadow = `0 2px 12px ${palette.red}20`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = palette.border;
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <i
                  className="bi bi-search"
                  style={{ color: palette.red, fontSize: "1.1rem" }}
                ></i>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "transparent",
                    color: palette.text,
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category Buttons Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {filteredCategories.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px 20px",
                  color: palette.label,
                }}
              >
                <i
                  className="bi bi-inbox"
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "10px",
                    display: "block",
                  }}
                ></i>
                <p>No categories found matching your search.</p>
              </div>
            ) : (
              filteredCategories.map(([name, data]) => (
                <button
                  key={name}
                  onClick={() => openModal(name)}
                  style={{
                    background: palette.cardBg,
                    border: `2px solid ${palette.border}`,
                    color: palette.text,
                    padding: "20px 16px",
                    borderRadius: "14px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    transition: "all 0.25s ease",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = palette.red;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 8px 20px ${palette.red}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = palette.border;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i
                    className={`bi ${data.icon}`}
                    style={{
                      fontSize: "1.8rem",
                      color: palette.red,
                    }}
                  ></i>
                  <span>{name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedCategory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: palette.cardBg,
              borderRadius: "16px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              border: `1px solid ${palette.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${palette.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: palette.text,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <i
                  className={`bi ${selectedCategory.icon}`}
                  style={{ color: palette.red, fontSize: "1.8rem" }}
                ></i>
                {selectedCategory.name}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: palette.label,
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = palette.red;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = palette.label;
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "16px",
                }}
              >
                {selectedCategory.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: isDark ? "#242b3d" : "#f8f9fa",
                      borderLeft: `4px solid ${palette.red}`,
                      borderRadius: "10px",
                      padding: "16px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.background = isDark
                        ? "#2c3547"
                        : "#f0f1f3";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.background = isDark
                        ? "#242b3d"
                        : "#f8f9fa";
                    }}
                  >
                    <small
                      style={{
                        color: palette.label,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "8px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: palette.red }}
                      ></i>
                      Available Task
                    </small>
                    <p
                      style={{
                        margin: 0,
                        color: palette.text,
                        fontSize: "0.95rem",
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "20px 24px",
                borderTop: `1px solid ${palette.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  background: palette.cardBg,
                  color: palette.text,
                  border: `2px solid ${palette.border}`,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = palette.red;
                  e.currentTarget.style.color = palette.red;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = palette.border;
                  e.currentTarget.style.color = palette.text;
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
