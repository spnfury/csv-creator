import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect them to the /admin page, but save the current location they were
    // trying to go to. This is not implemented yet, but it's a good practice.
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;