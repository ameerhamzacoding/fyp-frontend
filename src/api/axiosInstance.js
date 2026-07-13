import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Points directly to your Express engine endpoints
});

// This automatically attaches your secure JWT session token to headers if a user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default API;