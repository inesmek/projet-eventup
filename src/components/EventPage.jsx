import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './EventPage.css';
import facebookIcon from '../Assets/faceb.jpg';  // or .svg
import whatsappIcon from '../Assets/whatsup.jpg';
import linkedinIcon from '../Assets/linkdin.jpg';
import instaIcon from '../Assets/insta.jpg';

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Add mounted check

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/events/${id}`);
        
        // Only update state if component is still mounted
        if (isMounted) {
          console.log('Fetched Event:', response.data);
          setEvent(response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching event:', error);
          setError('Failed to load event details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvent();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const timeDate = new Date();
    timeDate.setHours(hours, minutes);
    return timeDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        alert('User session expired. Please login again.');
        navigate('/login');
        return;
      }

      // Send a request to create a reservation
      await axios.post('/reservations', { event_id: id });
      alert('Event reserved successfully!');

      // Navigate to the Reservations page
      navigate('/reservations');
    } catch (error) {
      console.error('Error reserving event:', error);
      alert('Failed to reserve event');
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="event-page">
        <div 
          className="event-hero"
          style={{
            backgroundImage: event.event_image ? 
              `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${event.event_image})` :
              'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
          }}
        >
          <button className="back-button" onClick={() => navigate(-1)}>
            <span>←</span> Back
          </button>
          <div className="hero-content">
            <h1>{event.event_title}</h1>
            <button className="view-map-btn">View map</button>
          </div>

          <div className="booking-card">
            <h3>Date & time</h3>
            <p>{formatDate(event.start_date)}, {formatTime(event.start_time)}</p>
            <p className="add-to-calendar">Add to calendar</p>
            <button className="book-now" onClick={handleBooking}>Book now</button>
            <p className="no-refunds">No Refunds</p>
          </div>
        </div>

        <div className="event-content">
          <div className="content-left">
            <div className="description">
              <h3>Description</h3>
              <p>{event.event_description}</p>
            </div>

            <div className="hours">
              <h3>Hours</h3>
              <p>Start: <span className="time-highlight">{formatTime(event.start_time)}</span></p>
              <p>End: <span className="time-highlight">{formatTime(event.end_time)}</span></p>
            </div>

            <div className="event-type">
              <h3>Event Type</h3>
              <p>{event.event_type}</p>
            </div>
          </div>

          <div className="content-right">
            <div className="location">
              <h3>Event location</h3>
              <div className="map">
                <iframe
                  title="Event Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(event.event_venue)}&output=embed`}
                ></iframe>
              </div>
              <h4>{event.event_venue}</h4>
            </div>

            <div className="share">
              <h3>Share with friends</h3>
              <div className="social-buttons">
                <a href="#" className="social-btn facebook">
                  <img src={facebookIcon} alt="Share on Facebook" />
                </a>
                <a href="#" className="social-btn whatsapp">
                  <img src={whatsappIcon} alt="Share on WhatsApp" />
                </a>
                <a href="#" className="social-btn linkedin">
                  <img src={linkedinIcon} alt="Share on LinkedIn" />
                </a>
                <a href="#" className="social-btn instagram">
                  <img src={instaIcon} alt="Share on Instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;