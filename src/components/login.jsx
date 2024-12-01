import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");

        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            
            console.log('Login Response:', response.data);
            
            // Store token
            localStorage.setItem('token', response.data.access_token);
            
            // Store user data including role
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('userRole', response.data.user.role);
            }
            
            // Redirect based on user role
            if (response.data.user.role === 'creator') {
                navigate("/dashboard");
            } else {
                navigate("/home");
            }
            
        } catch (error) {
            console.error('Login Error:', error.response?.data);
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError("Invalid email or password.");
                        break;
                    case 403:
                        setError("Your account is not active. Please contact support.");
                        break;
                    default:
                        setError("An unexpected error occurred. Please try again later.");
                }
            } else {
                setError("Network error. Please check your connection and try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="header">
                    <h1>Sign In to EventUp</h1>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>YOUR EMAIL</label>
                        <input 
                            type="email" 
                            placeholder="Enter your mail" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <div className="password-label-container">
                            <label>PASSWORD</label>
                            <a href="/forgot-password" className="forgot-password">
                                Forgot your password?
                            </a>
                        </div>
                        <div className="password-field">
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="sign-in-button">
                        Sign In
                    </button>
                </form>
            </div>
            <div className="login-right">
                <h2>HELLO FRIEND</h2>
                <p>To keep connected with us provide us with your information</p>
                <button 
                    className="signup-button" 
                    onClick={() => navigate("/signup")}
                >
                    Signup
                </button>
            </div>
        </div>
    );
};

export default Login;
/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Both fields are required.");
            return;
        }

        setError("");

        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            
            console.log('Login Response:', response.data);
            
            localStorage.setItem('token', response.data.access_token);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            navigate("/create-event");
            
        } catch (error) {
            console.error('Login Error:', error.response?.data);
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError("Invalid email or password.");
                        break;
                    case 403:
                        setError("Your account is not active. Please contact support.");
                        break;
                    default:
                        setError("An unexpected error occurred. Please try again later.");
                }
            } else {
                setError("Network error. Please check your connection and try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="header">
                
                    <h1>Sign In to EventUp</h1>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>YOUR EMAIL</label>
                        <input 
                            type="email" 
                            placeholder="Enter your mail" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <div className="password-label-container">
                            <label>PASSWORD</label>
                            <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
                        </div>
                        <div className="password-field">
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="sign-in-button">Sign In</button>
                </form>
            </div>
            <div className="login-right">
                <h2>HELLO FRIEND</h2>
                <p>To keep connected with us provide us with your information</p>
                <button className="signup-button" onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </div>
    );
};

export default Login;*/