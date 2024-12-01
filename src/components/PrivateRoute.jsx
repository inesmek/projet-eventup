// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
    const isAuthenticated = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('PrivateRoute - Auth Status:', !!isAuthenticated);
    console.log('PrivateRoute - User:', user);
    console.log('PrivateRoute - User Role:', user.role);
    console.log('PrivateRoute - Required Roles:', roles);

    // Check if the user is authenticated
    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" />;
    }

    // Check if user exists and has one of the required roles
    if (roles && (!user || !roles.includes(user.role))) {
        console.log('Insufficient permissions, redirecting to home');
        return <Navigate to="/home" />;
    }

    // If authenticated and has the required role, render the children
    return children;
};

export default PrivateRoute;