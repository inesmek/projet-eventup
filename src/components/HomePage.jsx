import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';  // Adjust path if needed
import DatePicker from "react-datepicker";
import axios from '../utils/axios';
import "react-datepicker/dist/react-datepicker.css";
import './HomePage.css';

const HomePage = () => {
  const [allEvents, setAllEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventTypes = [
    { value: 'professional', label: 'Professional' },
    { value: 'social', label: 'Social/Community ' },
    { value: 'educational', label: 'Educational ' },
    { value: 'entertainment', label: 'Entertainment ' },
    { value: 'sports', label: 'Sports and Wellness' },
    { value: 'cultural', label: 'Cultural and Religious' },
    { value: 'Virtual', label: 'Virtual Events' }
  ];

  const [filters, setFilters] = useState({
    event_type: '',
    location: '',
    date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('/events');
        
        if (response.data) {
          setAllEvents(response.data);
          setFilteredEvents(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching events');
        console.error('Error fetching events:', err);
        setAllEvents([]);
        setFilteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = allEvents;

    if (newFilters.event_type) {
      filtered = filtered.filter(event => 
        event.event_type?.toLowerCase() === newFilters.event_type.toLowerCase()
      );
    }

    if (newFilters.location) {
      filtered = filtered.filter(event => 
        event.event_venue?.toLowerCase().includes(newFilters.location.toLowerCase())
      );
    }

    if (newFilters.date) {
      const selectedDate = new Date(newFilters.date);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    setFilteredEvents(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleFilterChange('date', date);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSearchLocation(value);
    handleFilterChange('location', value);
  };

  const handleTypeChange = (e) => {
    handleFilterChange('event_type', e.target.value);
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>MADE FOR THOSE WHO DO</h1>
        <div className="search-container">
          <div className="search-filters">
            <div className="filter-group">
              <label>Looking for</label>
              <select 
                className="search-select"
                value={filters.event_type}
                onChange={handleTypeChange}
              >
                <option value="">All Event Types</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search location..."
                value={searchLocation}
                onChange={handleLocationChange}
              />
            </div>

            <div className="filter-group">
              <label>When</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select a date"
                className="search-input"
                minDate={new Date()}
                isClearable
              />
            </div>
          </div>
        </div>
      </div>

      <section className="events-section">
        <div className="events-header">
          <h2>Upcoming Events</h2>
        </div>

        {isLoading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <div className="events-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event}
                />
              ))
            ) : (
              <div className="no-events">
                <p>No events found matching your criteria</p>
                {filters.event_type || filters.location || filters.date ? (
                  <button 
                    onClick={() => {
                      setFilters({ event_type: '', location: '', date: '' });
                      setSelectedDate(null);
                      setSearchLocation('');
                      setFilteredEvents(allEvents);
                    }}
                    className="clear-filters-btn"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;