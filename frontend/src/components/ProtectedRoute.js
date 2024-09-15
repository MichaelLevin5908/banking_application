import React from 'react';
import { Navigate } from 'react-router-dom'; // For React Router v6

// Helper function to check if the user is authenticated
const isAuthenticated = () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Check if token exists and is not an empty string
    if (!token) {
        return false;
    }

    // Optionally: Add logic here to validate the token (e.g., checking expiration)
    return true; // Assume true if token exists for now
};

// Higher-order component to protect routes
const ProtectedRoute = ({ element: Element }) => {
    return isAuthenticated() ? <Element /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;

