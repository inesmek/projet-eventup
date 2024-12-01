import React from "react";
import "./Footer.css";
import eventup from "../Assets/eventup.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    

    return (
        <div className="footer-section">
      <div className="footer-top">
        <img src={eventup} alt="EventUp Logo" className="footer-logo" />
        <div className="newsletter">
          <input type="email" placeholder="Enter your mail" />
          <button type="button">Subscribe</button>
        </div>
        <nav className="footer-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="social-icons">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </div>
        <p>© 2024 EventUp.</p>
      </div>
    </div>
    );
};

export default Footer;
