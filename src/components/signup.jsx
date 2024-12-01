import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import "./signup.css";
import eventup from "../Assets/eventup.png";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validation
        if (!name || !email || !password || !role || !confirmPassword) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/register', {
                name: name.trim(),
                email: email.trim(),
                password: password,
                password_confirmation: confirmPassword,
                role: role === "organizer" ? "creator" : "user"
            });

            console.log('Registration response:', response.data);

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
            }
            if (response.data.user) {
                console.log('User role:', response.data.user.role);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userRole', response.data.user.role);
            }

            // Updated navigation logic
            if (response.data.user.role === 'creator') {
                navigate("/dashboard");
            } else {
                navigate("/home");
            }
            
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            
            if (error.response) {
                switch (error.response.status) {
                    case 422:
                        const validationErrors = error.response.data.errors;
                        if (validationErrors) {
                            const errorMessages = Object.values(validationErrors).flat();
                            setError(errorMessages.join(', '));
                        } else {
                            setError(error.response.data.message || "Validation error occurred.");
                        }
                        break;
                    case 409:
                        setError("This email is already registered.");
                        break;
                    case 500:
                        setError("Server error. Please try again later.");
                        break;
                    default:
                        setError("An unexpected error occurred. Please try again later.");
                }
            } else if (error.request) {
                setError("Network error. Please check your connection and try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <h2>WELCOME BACK</h2>
                <p>To keep connected with us please login with your personal info</p>
                <button 
                    className="signin-button" 
                    onClick={() => navigate("/login")}
                    disabled={isLoading}
                >
                    Sign In
                </button>
            </div>
            <div className="signup-right">
                <div className="header">
                    <img src={eventup} alt="EventUp Logo" className="logo" />
                    <h1>Sign Up to EventUp</h1>
                </div>
                <form className="signup-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>YOUR NAME</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>YOUR EMAIL</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>YOUR ROLE</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="organizer"
                                    checked={role === "organizer"}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                Event Organizer
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="visitor"
                                    checked={role === "visitor"}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                Visitor
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label>CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="sign-up-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;