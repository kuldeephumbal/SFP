import axios from 'axios';

// Get base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Derive image base URL from API base URL (assuming images are served from server root)
// If API_BASE_URL is 'http://localhost:5000/api', IMAGE_BASE_URL becomes 'http://localhost:5000'
export const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');

// Axios instance with configurable base URL
const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;

