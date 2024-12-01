import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import EventCard from './EventCard';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.id) {
        setError('User session expired. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`/events/user/${user.id}`);
      // Transform the events to match the format expected by EventCard
      const transformedEvents = response.data.map(event => ({
        ...event,
        event_image: event.event_image.replace('http://localhost:8000/storage/', '')
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event) => {
    const eventEndDate = new Date(event.end_date);
    const now = new Date();
    return eventEndDate < now ? 'past' : 'upcoming';
  };

  const filteredEvents = events.filter(event => {
    const status = getEventStatus(event);
    return status === activeTab;
  });

  const handleDeleteEvent = async (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/events/${eventId}`);
        await fetchUserEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Events</h1>
        
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button 
          className={`tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming events" 
                  : "You don't have any past events"}
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => navigate('/create-event')}
                  className="create-event-btn"
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="event-wrapper">
                <EventCard event={event} />
                <div className="event-actions">
                <button 
  className="edit-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-event/${event.id}`);
  }}
>
  Edit
</button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeleteEvent(event.id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;