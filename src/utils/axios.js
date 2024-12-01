// utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // Handle FormData requests
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
            // For Laravel PUT/DELETE requests with FormData
            if (config.method === 'put' || config.method === 'delete') {
                config.headers['X-HTTP-Method-Override'] = config.method.toUpperCase();
                config._method = config.method.toUpperCase();
                config.method = 'post';
            }
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        if (token) {
            // Clean and set token
            const cleanToken = token.replace('Bearer ', '').trim();
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }

        // Log request details in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Request:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                data: config.data
            });
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Response:', {
                status: response.status,
                data: response.data
            });
        }
        return response;
    },
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error('Network error - no response received');
            return Promise.reject(new Error('Network error - please check your connection'));
        }

        // Log error details in development
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', {
                status: error.response.status,
                data: error.response.data,
                config: error.config
            });
        }

        switch (error.response.status) {
            case 401: {
                // Unauthorized - clear storage and redirect to login
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login')) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                break;
            }

            case 403: {
                // Forbidden - redirect to home or show error message
                console.error('Permission denied');
                if (!window.location.pathname.includes('/home')) {
                    window.location.href = '/home';
                }
                break;
            }

            case 404: {
                console.error('Resource not found');
                break;
            }

            case 422: {
                // Validation errors
                const errors = error.response.data.errors;
                if (errors) {
                    const errorMessages = Object.values(errors).flat();
                    console.error('Validation errors:', errorMessages);
                }
                break;
            }

            case 500: {
                console.error('Server error:', error.response.data.message || 'Internal server error');
                break;
            }

            default: {
                console.error('API error:', error.response.data.message || 'An unexpected error occurred');
            }
        }

        // Customize error message based on response
        const errorMessage = error.response.data.message 
            || error.response.data.error 
            || 'An error occurred';

        error.customMessage = errorMessage;
        return Promise.reject(error);
    }
);

// Add custom methods for common API operations
instance.postFormData = async (url, formData, config = {}) => {
    return instance.post(url, formData, {
        ...config,
        headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
        },
    });
};

instance.putFormData = async (url, formData, config = {}) => {
    formData.append('_method', 'PUT');
    return instance.post(url, formData, {
        ...config,
        headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT',
        },
    });
};

export default instance;