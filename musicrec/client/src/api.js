import axios from 'axios';
import API_URL from './config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

export default api;

