import React from 'react';
import { Link } from 'react-router-dom';
import './FirstPage.css';
import logo from '../Assets/eventup.png';
import backgroundVideo from '../Assets/FirstPageVideo.mp4';

const FirstPage = () => {
  return (
    <div className="first-page">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      <div className="overlay"></div>

      <header className="first-page-header">
        <div className="logo-container">
          <img src={logo} alt="EventUp" className="logo-image" />
        </div>
        <nav className="nav-menu">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About US</Link></li>
            <li><Link to="/signup" className="join-button">Join Us</Link></li>
          </ul>
        </nav>
      </header>

      <div className="content-container">
        <div className="left-content">
          <div className="side-date">
            New event Organization Platform<br />
            10.25.2024
          </div>
          <h1 className="title">EXPLORE</h1>
        </div>

        <div className="right-content">
          <h1 className="title">OUR EXPERTISE</h1>
          <div className="connect-text">Let's Connect!</div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2024 EventUp.</p>
      </footer>
    </div>
  );
};

export default FirstPage;
