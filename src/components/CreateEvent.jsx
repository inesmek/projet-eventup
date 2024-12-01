import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateEvent.css';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_title: '',
    event_type: 'professional', // Default to first option
    event_venue: '',
    start_time: '',
    end_time: '',
    event_description: '',
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const eventTypes = [
    { value: 'professional', label: 'Professional' },
    { value: 'social', label: 'Social' },
    { value: 'educational', label: 'Educational' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports and Wellness' },
    { value: 'cultural', label: 'Cultural and Religious' },
    { value: 'hybrid', label: 'Virtual Events' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('event_title', formData.event_title.trim());
      formDataToSend.append('event_type', formData.event_type);
      formDataToSend.append('event_venue', formData.event_venue.trim());
      formDataToSend.append('start_time', formData.start_time);
      formDataToSend.append('end_time', formData.end_time);
      formDataToSend.append('start_date', startDate.toISOString().split('T')[0]);
      formDataToSend.append('end_date', endDate.toISOString().split('T')[0]);
      formDataToSend.append('event_description', formData.event_description.trim());
      
      if (image) {
        formDataToSend.append('event_image', image);
      }
  
      // Log the FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      const response = await axios.post('/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      console.log('Response:', response.data);
      
      if (response.data) {
        alert('Event created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Session expired. Please login again.');
            localStorage.removeItem('token');
            navigate('/login');
            break;
          case 403:
            setError('You do not have permission to create events.');
            break;
          case 422:
            const validationErrors = error.response.data.errors;
            const errorMessages = Object.values(validationErrors).flat();
            setError(errorMessages.join(', '));
            break;
          default:
            setError('An error occurred while creating the event.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="create-event-page">
      <div className="header-container">
        <h1>Create Event</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input 
            type="text" 
            name="event_title"
            value={formData.event_title}
            onChange={handleChange}
            placeholder="Enter event title" 
            required
          />
        </div>

        <div className="form-group">
          <label>Event Type</label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Event Venue</label>
          <input 
            type="text" 
            name="event_venue"
            value={formData.event_venue}
            onChange={handleChange}
            placeholder="Enter event venue" 
            required
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Start time</label>
            <input 
              type="time" 
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="time-input"
              required
            />
          </div>
          <div className="form-group">
            <label>End time</label>
            <input 
              type="time" 
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="time-input"
              required
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Start date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select start date"
              className="date-input"
              dateFormat="MM/dd/yyyy"
              required
              minDate={new Date()}
            />
          </div>
          <div className="form-group">
            <label>End date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Select end date"
              className="date-input"
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Event Image</label>
          <div 
            className={`image-upload-area ${previewUrl ? 'has-image' : ''}`} 
            onClick={() => document.getElementById('imageInput').click()}
          >
            {previewUrl ? (
              <div className="image-preview-container">
                <img src={previewUrl} alt="Preview" className="image-preview" />
                <div className="image-overlay">
                  <span>Click to change image</span>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span>Click to upload image</span>
              </div>
            )}
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Event Description</label>
          <textarea 
            name="event_description"
            value={formData.event_description}
            onChange={handleChange}
            placeholder="Type your event description here..."
            required
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="create-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;

/*import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CreateEvent.css';

const CreateEvent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="create-event-page">
      <h1>Create Event</h1>
      
      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" placeholder="Enter event title" />
        </div>

        <div className="form-group">
          <label>Event Venue</label>
          <input type="text" placeholder="Enter event venue" />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Start time</label>
            <input 
              type="time" 
              className="time-input"
            />
          </div>
          <div className="form-group">
            <label>End time</label>
            <input 
              type="time" 
              className="time-input"
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Start date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Enter your date"
              className="date-input"
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="form-group">
            <label>End date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Enter your date"
              className="date-input"
              dateFormat="MM/dd/yyyy"
            />
          </div>
        </div>

        <h2>Event Description</h2>
        
        <div className="form-group">
          <label>Event Image</label>
          <div 
            className={`image-upload-area ${previewUrl ? 'has-image' : ''}`} 
            onClick={() => document.getElementById('imageInput').click()}
          >
            {previewUrl ? (
              <div className="image-preview-container">
                <img src={previewUrl} alt="Preview" className="image-preview" />
                <div className="image-overlay">
                  <span>Click to change image</span>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span>Click to upload image</span>
              </div>
            )}
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Event Description</label>
          <textarea placeholder="Type here..."></textarea>
        </div>

        <button type="submit" className="create-event-button">Create event</button>
      </form>
    </div>
  );
};

export default CreateEvent;*/