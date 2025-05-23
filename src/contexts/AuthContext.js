// src/contexts/AuthContext.js - FIXED VERSION with register function
import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('healthping_token');
      if (token) {
        ApiService.setToken(token);
        
        // For mock tokens, create a mock user
        if (token.startsWith('mock-jwt-token')) {
          setUser({
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'demo@healthping.com',
            role: 'doctor',
            avatar: '👩‍⚕️'
          });
        } else {
          // Try to get real user data
          try {
            const userData = await ApiService.getCurrentUser();
            setUser(userData.user || userData);
          } catch (error) {
            console.warn('Failed to get user data, clearing token');
            localStorage.removeItem('healthping_token');
            ApiService.setToken(null);
          }
        }
      }
      
      // Also check for old stored user data (for compatibility)
      const storedUser = localStorage.getItem('healthping_user');
      if (storedUser && !user) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('healthping_token');
      localStorage.removeItem('healthping_user');
      ApiService.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await ApiService.login(email, password);
      
      // Handle different response formats
      const userData = response.user || response.data?.user || {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: email,
        role: 'doctor',
        avatar: '👩‍⚕️'
      };
      
      setUser(userData);
      localStorage.setItem('healthping_user', JSON.stringify(userData));
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ADD THE MISSING REGISTER FUNCTION
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('AuthContext: Starting registration with data:', userData);
      
      // Try real registration first
      let response;
      try {
        response = await ApiService.register(userData);
        console.log('AuthContext: Real registration response:', response);
      } catch (apiError) {
        console.log('AuthContext: Real registration failed, trying mock:', apiError);
        // If real registration fails, try mock
        response = await ApiService.mockRegister(userData);
        console.log('AuthContext: Mock registration response:', response);
      }
      
      // Handle different response formats
      const userResponse = response.user || response.data?.user || {
        id: Date.now(),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role,
        avatar: userData.role === 'doctor' ? '👨‍⚕️' : '👤',
        specialization: userData.specialization
      };
      
      console.log('AuthContext: Setting user:', userResponse);
      setUser(userResponse);
      localStorage.setItem('healthping_user', JSON.stringify(userResponse));
      
      return response;
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
      localStorage.removeItem('healthping_user');
      localStorage.removeItem('healthping_token');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await ApiService.updateProfile(userData);
      setUser(updatedUser.user || updatedUser);
      localStorage.setItem('healthping_user', JSON.stringify(updatedUser.user || updatedUser));
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      return await ApiService.forgotPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register, // ← THIS WAS MISSING!
    logout,
    updateProfile,
    forgotPassword,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};