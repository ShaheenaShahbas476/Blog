import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:3001';

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const register = (data) => axiosInstance.post('/register', data);
export const login = (data) => axiosInstance.post('/login', data);

// Blog API calls
export const createBlog = (data) => axiosInstance.post('/api/blogs', data);
export const fetchBlogs = () => axiosInstance.get('/api/blogs');
export const fetchBlogById = (id) => axiosInstance.get(`/api/blogs/${id}`);
