import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import EventCard from './EventCard'; // Import the EventCard component
import './Reservations.css'; // Optional: Create a CSS file for styling

const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchUserReservations();
  }, []);

  const fetchUserReservations = async () => {
    setLoading(true);
    setError(null);
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            setError('User session expired. Please login again.');
            navigate('/login');
            return;
        }

        const response = await axios.get(`/reservations/user/${user.id}`);
        setReservations(response.data); // Update state with fetched data
    } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Failed to load reservations');
    } finally {
        setLoading(false);
    }
};



        return (
            <div className="reservations-page">
              <h1>My Reservations</h1>
              {loading ? (
                <div className="loading">Loading reservations...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
      ) : (
        <div className="reservations-grid">
  {reservations.length === 0 ? (
    <p>You have no reservations.</p>
  ) : (
    reservations.map(reservation => (
        <EventCard key={reservation.id} event={reservation.event} />
    ))
  )}
</div>
      )}
    </div>
     );
    };
    
    export default Reservations;