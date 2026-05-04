import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Use environment variable for API URL (supports both development and production)
const API_URL = 'https://biolearn-api.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default header
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  }

  // Load user on mount
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Load user error:', err);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, userData);
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['x-auth-token'] = newToken;
      setToken(newToken);
      setUser(newUser);
      return res.data;
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: loggedInUser } = res.data;
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['x-auth-token'] = newToken;
      setToken(newToken);
      setUser(loggedInUser);
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, updates);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};