import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;  // Return true if token exists, otherwise false
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/signin" />;
};

export default ProtectedRoute;