import axios from 'axios';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Also configure the default axios instance
axios.defaults.baseURL = API_URL;

export default api;

