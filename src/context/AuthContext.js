import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // If there is a token, try to get current user
        if (token) {
          const response = await authService.getCurrentUser();
          setCurrentUser(response.data);
        }
      } catch (err) {
        // If error, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (credentials, userType) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (userType === 'admin') {
        response = await authService.loginAdmin(credentials);
      } else {
        response = await authService.loginCompany(credentials);
      }
      
      // Store token and user info in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userType', response.user.role);
      
      setCurrentUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    setCurrentUser(null);
  };

  // Change password function
  const changePassword = async (data) => {
    try {
      await authService.changePassword(data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
      throw err;
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process forgot password request.');
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    changePassword,
    forgotPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
