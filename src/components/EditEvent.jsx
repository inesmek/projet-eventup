import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './EditEvent.css';
import axios from '../utils/axios';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    event_title: "",
    event_type: "",
    event_venue: "",
    start_time: "",
    end_time: "",
    start_date: null,
    end_date: null,
    event_description: "",
    event_image: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventTypes = [
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Sports and Wellness', label: 'Sports and Wellness' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Cultural and Religious', label: 'Cultural and Religious' },
    { value: 'Virtual', label: 'Virtual' }
  ];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      const event = response.data;
      
      setFormData({
        event_title: event.event_title,
        event_type: event.event_type,
        event_venue: event.event_venue,
        start_time: event.start_time,
        end_time: event.end_time,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        event_description: event.event_description,
        event_image: null
      });

      if (event.event_image) {
        setPreviewUrl(`http://localhost:8000/storage/${event.event_image}`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError(error.response?.data?.message || 'Error fetching event');
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.substring(0, 5) === "image") {
      setFormData(prev => ({ ...prev, event_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('_method', 'PUT');
      formDataToSend.append('event_title', formData.event_title);
      formDataToSend.append('event_type', formData.event_type);
      formDataToSend.append('event_venue', formData.event_venue);
      formDataToSend.append('start_time', formData.start_time);
      formDataToSend.append('end_time', formData.end_time);
      formDataToSend.append('start_date', formData.start_date.toISOString().split('T')[0]);
      formDataToSend.append('end_date', formData.end_date.toISOString().split('T')[0]);
      formDataToSend.append('event_description', formData.event_description);
      
      if (formData.event_image instanceof File) {
        formDataToSend.append('event_image', formData.event_image);
      }

      const response = await axios.post(`/events/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      console.log('Update successful:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
      setError(error.response?.data?.message || 'Failed to update event');
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="edit-event-wrapper">
        <div className="edit-event-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-event-wrapper">
      <div className="edit-event-content">
        <div className="edit-event-page">
          <h1>Edit Event</h1>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form className="edit-event-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Title</label>
              <input 
                type="text" 
                value={formData.event_title}
                onChange={(e) => setFormData(prev => ({ ...prev, event_title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Event Type</label>
              <select 
                value={formData.event_type}
                onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                required
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
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
                value={formData.event_venue}
                onChange={(e) => setFormData(prev => ({ ...prev, event_venue: e.target.value }))}
                required
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Start time</label>
                <input 
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>End time</label>
                <input 
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Start date</label>
                <DatePicker
                  selected={formData.start_date}
                  onChange={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                  selectsStart
                  startDate={formData.start_date}
                  endDate={formData.end_date}
                  required
                />
              </div>
              <div className="form-group">
                <label>End date</label>
                <DatePicker
                  selected={formData.end_date}
                  onChange={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
                  selectsEnd
                  startDate={formData.start_date}
                  endDate={formData.end_date}
                  minDate={formData.start_date}
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
                />
              </div>
            </div>

            <div className="form-group">
              <label>Event Description</label>
              <textarea 
                value={formData.event_description}
                onChange={(e) => setFormData(prev => ({ ...prev, event_description: e.target.value }))}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;