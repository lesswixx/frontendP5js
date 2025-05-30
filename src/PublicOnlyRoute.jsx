import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider.jsx';

export default function PublicOnlyRoute({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    return !isAuthenticated
        ? children
        : <Navigate to="/calendar" replace />;
}
