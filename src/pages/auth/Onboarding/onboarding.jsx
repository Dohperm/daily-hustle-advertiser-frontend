import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from '../../../context/LoadingContext';

const Onboarding = ({ userEmail, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    account_identifier: 'Individual',
    country: 'Ghana',
    referral_code: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoading();
    
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Profile completed successfully! 🎉');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      toast.error('Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="colored" autoClose={3000} />
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 px-3" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="bg-white rounded-4 shadow-xl p-4 p-md-5 w-100" style={{ maxWidth: '500px' }}>
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-person-check-fill text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h2 className="fw-bold mb-2">Complete Your Profile</h2>
            <p className="text-muted">Just a few more details to get you started</p>
            <div className="progress mb-3" style={{ height: '6px' }}>
              <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label fw-semibold text-dark">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control form-control-lg rounded-3"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ borderColor: '#e0e6ed' }}
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold text-dark">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control form-control-lg rounded-3"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{ borderColor: '#e0e6ed' }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">Username</label>
              <input
                type="text"
                name="username"
                className="form-control form-control-lg rounded-3"
                value={formData.username}
                onChange={(e) => setFormData({
                  ...formData,
                  username: e.target.value.replace(/\s/g, '').toLowerCase()
                })}
                required
                minLength={3}
                disabled={loading}
                style={{ borderColor: '#e0e6ed' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-lg rounded-3"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ borderColor: '#e0e6ed' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">What do you identify as?</label>
              <select
                name="account_identifier"
                className="form-select form-select-lg rounded-3"
                value={formData.account_identifier}
                onChange={handleChange}
                disabled={loading}
                style={{ borderColor: '#e0e6ed' }}
              >
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-dark">Country</label>
              <select
                name="country"
                className="form-select form-select-lg rounded-3"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                style={{ borderColor: '#e0e6ed' }}
              >
                <option value="Ghana">Ghana</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-dark">Referral Code (Optional)</label>
              <input
                type="text"
                name="referral_code"
                className="form-control form-control-lg rounded-3"
                value={formData.referral_code}
                onChange={handleChange}
                disabled={loading}
                style={{ borderColor: '#e0e6ed' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 py-3 fw-bold text-white rounded-3"
              disabled={loading}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
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

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Email: <strong>{userEmail}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;