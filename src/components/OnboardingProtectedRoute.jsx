import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdvertiserData } from '../pages/hooks/useAppDataContext';
import GlobalSpinner from './GlobalSpinner';
import api from '../pages/services/api';

function OnboardingProtectedRoute({ children }) {
  const { userLoggedIn } = useAdvertiserData();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      const token = localStorage.getItem('token');
      const isAuth = localStorage.getItem('isAuth');
      
      if (token && isAuth === 'true') {
        try {
          const response = await api.get('/advertisers/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.status === 200) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('isAuth');
        }
      }
      setLoading(false);
    };
    checkUserProfile();
  }, [userLoggedIn]);

  if (loading) return <GlobalSpinner isLoading={true} />;
  const token = localStorage.getItem('token');
  const isAuth = localStorage.getItem('isAuth');
  
  if (!token || isAuth !== 'true') return <Navigate to="/login" replace />;
  
  const needsOnboarding = !user?.first_name || !user?.username;
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;
  
  return children;
}

export default OnboardingProtectedRoute;