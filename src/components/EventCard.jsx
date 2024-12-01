// EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event }) => {
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
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const timeDate = new Date();
    timeDate.setHours(hours, minutes);
    return timeDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Construire l'URL de l'image ici
  const imageUrl = event.event_image ? 
    `http://localhost:8000/storage/${event.event_image}` : 
    null;

  return (
    <Link to={`/event/${event.id}`} className="event-card">
      <div 
        className="event-image"
        style={{
          backgroundImage: imageUrl ? 
            `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${imageUrl})` :
            'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
        }}
      />
      <div className="event-info">
        <h3>{event.event_title}</h3>
        <p className="event-date">
          {formatDate(event.start_date)}
          {event.start_time && `, ${formatTime(event.start_time)}`}
        </p>
        <p className="event-location">{event.event_venue}</p>
        <p className="event-type">{event.event_type}</p>
      </div>
    </Link>
  );
};

export default React.memo(EventCard);