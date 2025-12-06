import React from 'react';

const GlobalSpinner = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="global-spinner-overlay">
      <div className="global-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-text">Loading...</div>
      </div>
    </div>
  );
};

export default GlobalSpinner;