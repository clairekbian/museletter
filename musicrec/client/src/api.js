import axios from 'axios';

// API Configuration - hardcoded for production
const API_URL = 'https://museletter.onrender.com';

console.log('API URL configured:', API_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Also configure the default axios instance
axios.defaults.baseURL = API_URL;

export default api;

