import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import WelcomePage from './components/FirstPage';
import HomePage from './components/HomePage';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import Login from './components/login';
import SignUp from './components/signup';
import Dashboard from './components/dashboard';
import AboutUs from './components/AboutUs';
import EventDetails from './components/EventPage';
import Reservations from './components/Reservations'; // Import the Reservations component

const AppContent = () => {
  const location = useLocation();
  
  // Define paths where header should not be shown
  const noHeaderPaths = ['/', '/login', '/signup'];
  
  // Define paths where footer should not be shown
  const noFooterPaths = ['/', '/login', '/signup', '/dashboard', '/create-event', '/edit-event', '/reservations'];
  
  // Check if current path should show header/footer
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);
  const shouldShowFooter = !noFooterPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowHeader && <Header />}
      <div className={shouldShowHeader ? 'main-content' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/event/:id" element={<EventDetails />} />
          
          {/* Protected Routes */}
          <Route 
            path="/create-event" 
            element={
              <PrivateRoute role="creator">
                <CreateEvent />
              </PrivateRoute>
            }
          />
          
          <Route 
            path="/edit-event/:id" 
            element={
              <PrivateRoute role="creator">
                <EditEvent />
              </PrivateRoute>
            }
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute role="creator">
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route 
  path="/reservations" 
  element={
    <PrivateRoute roles={['user', 'creator']}> {/* Allow both roles */}
      <Reservations />
    </PrivateRoute>
  }
/>
        </Routes>
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;