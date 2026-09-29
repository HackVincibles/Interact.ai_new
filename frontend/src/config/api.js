// Centralized API Configuration for Interact.ai Frontend
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export default API_BASE_URL;
