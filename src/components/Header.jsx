import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import eventup from "../Assets/eventup.png";

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Header - User:', user);
    console.log('Header - User Role:', user.role);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        navigate('/');
        window.location.reload();
    };

    return (
        <header className="header-container">
            <div className="header-left">
                <Link to="/home">
                    <img src={eventup} alt="EventUp Logo" className="header-logo" />
                </Link>
            </div>
            
            <nav className="header-nav">
                <Link to="/home">Home</Link>
                <Link to="/about">About</Link>
                {isAuthenticated && (
                    <>
                        <Link to="/reservations">Reservations</Link> {/* Link to Reservations page */}
                        {user.role === 'creator' && (
                            <>
                                <Link to="/create-event">Create Event</Link>
                                <Link to="/dashboard">Dashboard</Link>
                            </>
                        )}
                    </>
                )}
            </nav>

            <div className="header-right">
                {isAuthenticated ? (
                    <div className="user-section">
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">Login</Link>
                )}
            </div>
        </header>
    );
};

export default Header;