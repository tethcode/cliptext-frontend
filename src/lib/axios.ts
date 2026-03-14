import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cliptext-backend.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cliptext_token');
  
  if (token) {
    // IMPORTANT: Note the word "Token" followed by a space.
    // If you are using JWT, change "Token" to "Bearer"
    config.headers.Authorization = `Token ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
