import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import About from '../Assets/About.png';
import EventCard from '../components/EventCard';
import axios from '../utils/axios';

const AboutUs = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="about-wrapper">
      {/* Existing About Section */}
      <div className="about-container">
        <section className="about-hero">
          <div className="about-content">
            <p className="about-tagline">Thriving Above Event Expectations</p>
            <h1 className="about-heading">
              EventUp-ing<br />
              the Best.Day.<br />
              Ever.
            </h1>
            <div className="about-stats">
              <div className="about-stat-box">
                <h3>2k+</h3>
                <p>Total Events<br />Hosted</p>
              </div>
              <div className="about-stat-box">
                <h3>100+</h3>
                <p>Total Events<br />Live</p>
              </div>
            </div>
          </div>
          <div className="about-image-wrapper">
            <img src={About} alt="Event" />
          </div>
        </section>
      </div>

      {/* New Events Section */}
      <div className="about-events-container">
        <section className="events-section">
          <div className="events-header">
            <h2>Events around you </h2>
          </div>

          {isLoading ? (
            <div className="loading">Loading events...</div>
          ) : (
            <div className="events-grid">
              {events.length > 0 ? (
                events.slice(0, 6).map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                  />
                ))
              ) : (
                <div className="no-events">
                  <p>No events available at the moment</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AboutUs;