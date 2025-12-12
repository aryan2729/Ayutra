import axios from 'axios';
import { getToken, signOut } from '../lib/auth';

// API Base URL - Update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - sign out and redirect to login
      await signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authAPI = {
  // Login endpoint
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Register endpoint
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Logout endpoint
  logout: () => {
    return api.post('/auth/logout');
  },

  // Refresh token endpoint
  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  // Get current user
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  // Google OAuth login
  googleLogin: (token) => {
    return api.post('/auth/google', { token });
  },

  // Apple OAuth login
  appleLogin: (token) => {
    return api.post('/auth/apple', { token });
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },
};

// Patient API endpoints
export const patientAPI = {
  // Get all patients (for practitioners/admins)
  getAll: (params) => {
    return api.get('/patients', { params });
  },

  // Get patient by ID
  getById: (id) => {
    return api.get(`/patients/${id}`);
  },

  // Create patient profile
  create: (patientData) => {
    return api.post('/patients', patientData);
  },

  // Update patient profile
  update: (id, patientData) => {
    return api.put(`/patients/${id}`, patientData);
  },

  // Delete patient
  delete: (id) => {
    return api.delete(`/patients/${id}`);
  },

  // Get patient constitution (Prakriti)
  getConstitution: (id) => {
    return api.get(`/patients/${id}/constitution`);
  },
};

// Diet Plan API endpoints
export const dietPlanAPI = {
  // Get all diet plans
  getAll: (params) => {
    return api.get('/diet-plans', { params });
  },

  // Get diet plan by ID
  getById: (id) => {
    return api.get(`/diet-plans/${id}`);
  },

  // Create diet plan
  create: (planData) => {
    return api.post('/diet-plans', planData);
  },

  // Update diet plan
  update: (id, planData) => {
    return api.put(`/diet-plans/${id}`, planData);
  },

  // Delete diet plan
  delete: (id) => {
    return api.delete(`/diet-plans/${id}`);
  },

  // Generate AI diet plan
  generateAI: (preferences) => {
    return api.post('/diet-plans/generate', preferences);
  },
};

// Food API endpoints
export const foodAPI = {
  // Get all foods
  getAll: (params) => {
    return api.get('/foods', { params });
  },

  // Get food by ID
  getById: (id) => {
    return api.get(`/foods/${id}`);
  },

  // Search foods
  search: (query, filters) => {
    return api.get('/foods/search', { params: { q: query, ...filters } });
  },
};

// Analytics API endpoints
export const analyticsAPI = {
  // Get patient progress
  getProgress: (patientId, params) => {
    return api.get(`/analytics/patients/${patientId}/progress`, { params });
  },

  // Get compliance metrics
  getCompliance: (patientId) => {
    return api.get(`/analytics/patients/${patientId}/compliance`);
  },

  // Get health insights
  getInsights: (patientId) => {
    return api.get(`/analytics/patients/${patientId}/insights`);
  },
};

// Compliance API endpoints
export const complianceAPI = {
  // Mark meal as consumed/not consumed
  markMeal: (data) => {
    return api.post('/compliance/meal', data);
  },

  // Get daily compliance
  getDaily: (date) => {
    return api.get('/compliance/daily', { params: { date } });
  },

  // Get weekly compliance
  getWeekly: (weekStart) => {
    return api.get('/compliance/weekly', { params: { weekStart } });
  },

  // Get monthly compliance
  getMonthly: (month, year) => {
    return api.get('/compliance/monthly', { params: { month, year } });
  },
};

export default api;
