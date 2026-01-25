import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const auth = useAuth();

    if (!auth) return null;

    const { user, logout } = auth;

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">RecipeFinder</Link>
            </div>
            
            <ul className="navbar-links">
                {/*This is the core of this dynamic UI. use a ternary operator to check if a `user` object exists. */}
                {user ? (
// If `user` exists, the user is logged in. Show these links.
                    <>
                    <li className="navbar-greeting">Welcome, {user.name}!</li>
                    <li>
                        <Link to="/favorites">My Favorites</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </li>
                    </>
                    ) : (
                    <>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </>
            )}
            </ul>
        </nav>
    );
};

export default Navbar;