import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';

import {useAuth} from '../context/AuthContext';

/**
 * A wrapper component that protects routes from unauthenticated access.
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The component/page to render if the user is authenticated.
 * @returns {React.ReactElement} - The protected component or a redirection to the login page.
 */
const  ProtectedRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{from: location}} />;
    }
    return children;
};

export default ProtectedRoute;
