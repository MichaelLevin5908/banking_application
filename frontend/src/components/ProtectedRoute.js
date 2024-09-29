// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
            // Token has expired
            localStorage.removeItem('token'); // Remove expired token
            return false;
        }
        return true;
    } catch (error) {
        // Invalid token
        localStorage.removeItem('token'); // Remove invalid token
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    return isAuthenticated() ? (
        children
    ) : (
        <Navigate to="/signin" replace state={{ from: location }} />
    );
};

export default ProtectedRoute;

