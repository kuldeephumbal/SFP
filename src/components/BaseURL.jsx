import axios from 'axios';

// Get base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Derive image base URL from API base URL
export const IMAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Helper to construct a safe image URL
 * @param {string} photo - The photo path from DB
 * @returns {string} - Full encoded URL
 */
export const getImageUrl = (photo) => {
    if (!photo) return '';
    if (photo.startsWith('http')) return photo;
    if (photo.startsWith('/assets/')) return photo;

    // Remove trailing slash from base if present
    const base = IMAGE_BASE_URL.replace(/\/+$/, '');
    // Remove leading slash from path if present
    const path = photo.replace(/^\/+/, '');

    return `${base}/${path}`;
};

// Axios instance with configurable base URL
const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;

