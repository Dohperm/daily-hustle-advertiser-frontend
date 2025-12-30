import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from '../../../context/LoadingContext';
import { useTheme } from '../../../context/ThemeContext';
import { advertiserProfile, advertiserVerifyUsername } from '../../services/services';
import api from '../../services/api';

const Onboarding = ({ userEmail, preFilledData, onComplete }) => {
  const location = useLocation();
  const existingProfile = location.state?.userProfile;
  const [loading, setLoading] = useState(false);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { showLoading, hideLoading } = useLoading();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    first_name: existingProfile?.first_name || preFilledData?.first_name || '',
    last_name: existingProfile?.last_name || preFilledData?.last_name || '',
    username: existingProfile?.username || '',
    phone: existingProfile?.phone || '',
    account_identifier: existingProfile?.account_identifier || 'Individual',
    country: existingProfile?.country || 'Nigeria',
    referral_code: existingProfile?.referral_code || ''
  });
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });

  // Check if user is from OAuth and fetch profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await advertiserProfile();
        const profile = response.data?.data;
        setUserProfile(profile);
        
        if (profile?.auth_provider && (profile.auth_provider === 'google' || profile.auth_provider === 'facebook')) {
          setIsOAuthUser(true);
          setFormData(prev => ({
            ...prev,
            first_name: profile.first_name || prev.first_name,
            last_name: profile.last_name || prev.last_name
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }
    
    setUsernameStatus({ checking: true, available: null, message: 'Checking...' });
    try {
      const response = await advertiserVerifyUsername(username);
      const isAvailable = response.data?.data?.isAvailable;
      setUsernameStatus({
        checking: false,
        available: isAvailable,
        message: isAvailable ? 'Username is available!' : 'Username is already taken'
      });
    } catch (error) {
      setUsernameStatus({ checking: false, available: false, message: 'Error checking username' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoading();
    
    try {
      if (onComplete) {
        await onComplete(formData);
      } else {
        // Direct API call if no onComplete handler
        const response = await api.post("/auths/advertisers/onboarding", formData);
        if (response.status === 200) {
          toast.success('Profile completed successfully! 🎉');
          setTimeout(() => (window.location.href = '/'), 1500);
        }
      }
    } catch (err) {
      toast.error('Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <>
      <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-4" 
           style={{ 
             background: isDark ? '#1a1a1a' : '#f8f9fa', 
             fontFamily: 'Poppins, system-ui, sans-serif',
             padding: window.innerWidth < 768 ? '20px 15px' : '0 20px'
           }}>
        
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('isAuth');
            window.location.href = '/';
          }}
          className="position-absolute top-0 start-0 m-4 btn btn-outline-secondary rounded-pill px-4 py-2"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Home
        </button>

        <div className="rounded-4 shadow p-5 w-100" style={{ 
          maxWidth: '550px',
          width: '100%', 
          background: isDark ? '#2d2d2d' : '#ffffff',
          border: `1px solid ${isDark ? '#404040' : '#e9ecef'}` 
        }}>
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-person-check-fill" style={{ fontSize: '3rem', color: '#e53e3e' }}></i>
            </div>
            <h2 className="fw-bold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Complete Your Profile</h2>
            <p style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>Just a few more details to get you started</p>
            <div className="progress mb-3" style={{ height: '6px', background: '#e9ecef' }}>
              <div className="progress-bar" style={{ width: '75%', background: '#e53e3e' }}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control form-control-lg py-3"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  disabled={loading || isOAuthUser}
                  style={{ 
                    border: '2px solid #e9ecef', 
                    borderRadius: '12px', 
                    fontSize: '1rem',
                    ...(isOAuthUser ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {})
                  }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control form-control-lg py-3"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={loading || isOAuthUser}
                  style={{ 
                    border: '2px solid #e9ecef', 
                    borderRadius: '12px', 
                    fontSize: '1rem',
                    ...(isOAuthUser ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {})
                  }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Username</label>
              <div className="position-relative">
                <input
                  type="text"
                  name="username"
                  className="form-control form-control-lg py-3 pe-5"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => {
                    const username = e.target.value.replace(/\s/g, '').toLowerCase();
                    setFormData({ ...formData, username });
                    checkUsernameAvailability(username);
                  }}
                  required
                  minLength={3}
                  disabled={loading}
                  style={{ 
                    border: `2px solid ${usernameStatus.available === false ? '#dc3545' : usernameStatus.available === true ? '#28a745' : '#e9ecef'}`, 
                    borderRadius: '12px', 
                    fontSize: '1rem' 
                  }}
                />
                {usernameStatus.checking && (
                  <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                    <div className="spinner-border spinner-border-sm" style={{ width: '1rem', height: '1rem' }}></div>
                  </div>
                )}
                {!usernameStatus.checking && usernameStatus.available !== null && (
                  <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                    <i className={`bi ${usernameStatus.available ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                  </div>
                )}
              </div>
              {usernameStatus.message && (
                <div className={`small mt-1 ${usernameStatus.available ? 'text-success' : 'text-danger'}`}>
                  {usernameStatus.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-lg py-3"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ border: '2px solid #e9ecef', borderRadius: '12px', fontSize: '1rem' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>What do you identify as?</label>
              <div className="d-flex gap-3">
                <div className="flex-fill">
                  <input
                    type="radio"
                    id="individual"
                    name="account_identifier"
                    value="Individual"
                    checked={formData.account_identifier === 'Individual'}
                    onChange={handleChange}
                    className="btn-check"
                    disabled={loading}
                  />
                  <label
                    className="btn btn-outline-secondary w-100 py-3"
                    htmlFor="individual"
                    style={{
                      borderRadius: '12px',
                      border: formData.account_identifier === 'Individual' ? '2px solid #e53e3e' : '2px solid #e9ecef',
                      background: formData.account_identifier === 'Individual' ? '#fff5f0' : 'white',
                      color: formData.account_identifier === 'Individual' ? '#e53e3e' : '#6c757d'
                    }}
                  >
                    Individual
                  </label>
                </div>
                <div className="flex-fill">
                  <input
                    type="radio"
                    id="organization"
                    name="account_identifier"
                    value="Organization"
                    checked={formData.account_identifier === 'Organization'}
                    onChange={handleChange}
                    className="btn-check"
                    disabled={loading}
                  />
                  <label
                    className="btn btn-outline-secondary w-100 py-3"
                    htmlFor="organization"
                    style={{
                      borderRadius: '12px',
                      border: formData.account_identifier === 'Organization' ? '2px solid #e53e3e' : '2px solid #e9ecef',
                      background: formData.account_identifier === 'Organization' ? '#fff5f0' : 'white',
                      color: formData.account_identifier === 'Organization' ? '#e53e3e' : '#6c757d'
                    }}
                  >
                    Organization
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Country</label>
              <select
                name="country"
                className="form-select form-select-lg py-3"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                style={{ border: '2px solid #e9ecef', borderRadius: '12px', fontSize: '1rem' }}
              >
                <option value="Ghana">Ghana</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold mb-2" style={{ color: isDark ? '#ffffff' : '#2c3e50' }}>Referral Code (Optional)</label>
              <input
                type="text"
                name="referral_code"
                className="form-control form-control-lg py-3"
                placeholder="Enter referral code (optional)"
                value={formData.referral_code}
                onChange={handleChange}
                disabled={loading}
                style={{ border: '2px solid #e9ecef', borderRadius: '12px', fontSize: '1rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 py-3 fw-bold text-white mb-4"
              disabled={loading || usernameStatus.available === false}
              style={{
                background: '#e53e3e',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Completing Profile...
                </>
              ) : (
                'Complete Profile'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="mb-0" style={{ color: isDark ? '#b0b3c0' : '#6c757d' }}>
              Email: <strong style={{ color: '#e53e3e' }}>{userEmail}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;