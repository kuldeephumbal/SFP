import axios from 'axios';

// Axios instance with configurable base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export default api;
