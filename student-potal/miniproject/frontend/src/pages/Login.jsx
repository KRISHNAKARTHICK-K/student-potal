import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API base URL - adjust this to match your backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Call login API using axios
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store JWT token in localStorage
        const token = response.data.token;
        const user = response.data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect user based on role
        const role = user.role.toLowerCase();
        
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'teacher') {
          navigate('/teacher/dashboard');
        } else if (role === 'student') {
          navigate('/dashboard');
        } else {
          // Default redirect if role doesn't match
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle error response
      if (error.response) {
        // Server responded with error status
        setErrors({
          general: error.response.data.message || 'Login failed. Please check your credentials.'
        });
      } else if (error.request) {
        // Request was made but no response received
        setErrors({
          general: 'Network error. Please check your connection.'
        });
      } else {
        // Something else happened
        setErrors({
          general: 'An error occurred. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f3f4f6', 
      padding: '1rem' 
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', 
        padding: '2rem' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '0.5rem' 
          }}>
            Student Portal
          </h1>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '0.5rem' 
          }}>
            Sign In
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Welcome back! Please enter your credentials.
          </p>
        </div>
        
        {errors.general && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{ 
                width: '100%', 
                padding: '0.875rem', 
                border: errors.email ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => !errors.email && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.email && (
              <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{ 
                width: '100%', 
                padding: '0.875rem', 
                border: errors.password ? '2px solid #ef4444' : '2px solid #e5e7eb', 
                borderRadius: '8px', 
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => !errors.password && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.password && (
              <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              backgroundColor: loading ? '#9ca3af' : '#3b82f6', 
              color: 'white', 
              fontWeight: '600', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '1rem', 
              marginBottom: '1.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontWeight: '600', 
                  color: '#3b82f6', 
                  cursor: 'pointer' 
                }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
