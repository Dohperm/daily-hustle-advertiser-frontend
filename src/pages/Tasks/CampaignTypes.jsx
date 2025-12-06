import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// All campaigns from your Excel sheet
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

export default function CampaignTypes() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredCampaign, setHoveredCampaign] = useState(null);
  const [search, setSearch] = useState("");

  const filteredCampaigns = campaignTypesData.filter(campaign =>
    campaign.job_title.toLowerCase().includes(search.toLowerCase()) ||
    campaign.job_category.toLowerCase().includes(search.toLowerCase()) ||
    campaign.sub_job_category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCampaignClick = (campaign) => {
    localStorage.setItem('selectedCampaignType', JSON.stringify({
      jobTitle: campaign.job_title,
      category: campaign.job_category,
      subCategory: campaign.sub_job_category,
      jobDescription: campaign.job_description,
      instructions: campaign.job_instructions,
      minDuration: campaign.min_duration,
      complexityRating: campaign.complexity_rating,
      amount: campaign.amount
    }));
    navigate('/jobs/new');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Facebook': 'bi-facebook',
      'Instagram': 'bi-instagram', 
      'LinkedIn': 'bi-linkedin',
      'Twitter [X]': 'bi-twitter-x',
      'TikTok': 'bi-tiktok',
      'YouTube': 'bi-youtube',
      'Telegram': 'bi-telegram',
      'WhatsApp': 'bi-whatsapp',
      'Snapchat': 'bi-snapchat',
      'Threads': 'bi-threads',
      'Online Vote': 'bi-check2-square',
      'Review': 'bi-star-fill',
      'Sign Up': 'bi-person-plus',
      'Stream Music': 'bi-music-note-beamed',
      'Survey': 'bi-clipboard-data',
      'UGC': 'bi-camera-video',
      'Website': 'bi-globe',
      'Whatsapp': 'bi-whatsapp'
    };
    return icons[category] || 'bi-briefcase';
  };

  return (
    <div style={{ 
      padding: window.innerWidth < 768 ? '20px 15px' : '40px 20px', 
      minHeight: '100vh',
      background: isDark ? '#121212' : '#f8f9fa',
      color: isDark ? '#f7f7fa' : '#212529'
    }}>
      <div className="container">
        {/* Title Section */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: window.innerWidth < 768 ? "1.8rem" : "2.5rem",
              color: isDark ? '#f7f7fa' : '#212529',
              letterSpacing: "0.5px",
            }}
          >
            <i
              className="bi bi-grid-3x3-gap me-3"
              style={{ color: '#e53e3e', fontSize: "2rem" }}
            ></i>
            Campaign Types
          </h1>
          <p style={{ color: isDark ? '#adb5bd' : '#6c757d', fontSize: "1.05rem" }}>
            Choose from available campaign types to create your task
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
                background: isDark ? '#2d2d2d' : '#fff',
                border: `2px solid ${isDark ? '#404040' : '#dee2e6'}`,
                borderRadius: "12px",
                padding: "12px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#e53e3e';
                e.currentTarget.style.boxShadow = "0 2px 12px #e53e3e20";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#404040' : '#dee2e6';
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <i
                className="bi bi-search"
                style={{ color: '#e53e3e', fontSize: "1.1rem" }}
              ></i>
              <input
                type="text"
                placeholder="Search campaign types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  color: isDark ? '#f7f7fa' : '#212529',
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>
        </div>
        
        <Row className="g-4">
          {filteredCampaigns.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 20px",
                color: isDark ? '#adb5bd' : '#6c757d',
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
              <p>No campaign types found matching your search.</p>
            </div>
          ) : (
            filteredCampaigns.map((campaign, index) => (
            <Col key={index} xs={12} sm={6} lg={4}>
              <div
                style={{
                  border: hoveredCampaign === index ? '2px solid #e53e3e' : `1px solid ${isDark ? '#404040' : '#dee2e6'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  backgroundColor: isDark ? '#2d2d2d' : 'white',
                  transition: 'all 0.3s ease',
                  transform: hoveredCampaign === index ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredCampaign === index ? '0 8px 25px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)',
                  minHeight: '300px'
                }}
                onMouseEnter={() => setHoveredCampaign(index)}
                onMouseLeave={() => setHoveredCampaign(null)}
                onClick={() => handleCampaignClick(campaign)}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className={`bi ${getCategoryIcon(campaign.job_category)}`} style={{ color: '#e53e3e', fontSize: '1.2rem' }}></i>
                  <Badge style={{ backgroundColor: '#e53e3e', border: 'none' }}>{campaign.job_category}</Badge>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: isDark ? '#f7f7fa' : '#212529' }}>{campaign.job_title}</h5>
                <p className="mb-3" style={{ color: isDark ? '#adb5bd' : '#6c757d' }}>{campaign.sub_job_category}</p>

                {hoveredCampaign === index && (
                  <div style={{ 
                    background: isDark ? '#1a1a1a' : '#f8f9fa', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    border: `1px solid ${isDark ? '#404040' : '#dee2e6'}`
                  }}>
                    <div className="mb-3">
                      <strong style={{ fontSize: '0.9rem' }}>Description:</strong>
                      <p className="mb-0 small mt-1" style={{ color: isDark ? '#adb5bd' : '#6c757d' }}>{campaign.job_description}</p>
                    </div>
                    <div className="mb-3">
                      <strong style={{ fontSize: '0.9rem' }}>Instructions:</strong>
                      <p className="mb-0 small mt-1" style={{ color: isDark ? '#adb5bd' : '#6c757d' }}>{campaign.job_instructions}</p>
                    </div>
                    <div className="mb-3">
                      <strong style={{ fontSize: '0.9rem' }}>Amount:</strong>
                      <p className="mb-0 fw-bold mt-1" style={{ color: '#e53e3e' }}>{campaign.amount}</p>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <strong style={{ fontSize: '0.85rem' }}>Duration:</strong>
                        <p className="mb-0 small mt-1">{campaign.min_duration}</p>
                      </div>
                      <div className="col-6">
                        <strong style={{ fontSize: '0.85rem' }}>Complexity:</strong>
                        <br />
                        <Badge 
                          bg={campaign.complexity_rating === 'Easy' ? 'success' : 
                              campaign.complexity_rating === 'Medium' ? 'warning' : 'danger'} 
                          className="mt-1"
                        >
                          {campaign.complexity_rating}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  className="btn w-100 fw-bold"
                  style={{ 
                    marginTop: 'auto',
                    backgroundColor: '#e53e3e',
                    borderColor: '#e53e3e',
                    color: 'white'
                  }}
                >
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Create Campaign
                </button>
              </div>
            </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
}