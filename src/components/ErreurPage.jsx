import React from "react";
import { Link } from "react-router-dom";
import "./ErreurPage.css";
// import Footer from "../ReactComponent/Footer"; // Commented out Footer import
import eventup from "../Assets/eventup.png";
import er from "../Assets/er.png";

const ErreurPage = () => {
    return (
        <div className="erreur-container">
            <div className="head">
                <div className="logo">
                    <img src={eventup} alt="EventUp Logo" />
                </div>
                <div className="sign">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/signup" className="signup-btn">SignUp</Link>
                </div>
            </div>
            <div className="error-content">
                <div className="error-image">
                    <img src={er} alt="404 Error" />
                </div>
                <div className="error-text">
                    <h1>Oops!</h1>
                    <p>We can't seem to find the page you are looking for</p>
                    <Link to="/" className="home-btn">Back to Homepage</Link>
                </div>
                <div className="social-links">
                    <p>Follow us on</p>
                    <div className="social-icons">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
            {/* <Footer /> */} {/* Commented out Footer component */}
        </div>
    );
};

export default ErreurPage;