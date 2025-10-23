// API Configuration for connecting to Docker backend
// This replaces Supabase for the self-hosted backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Storage for JWT token
const TOKEN_KEY = 'ekidna_auth_token';

// Get stored token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Store token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// API client with authentication
const apiClient = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 - Unauthorized
    if (response.status === 401) {
      removeToken();
      window.location.href = '/'; // Redirect to login
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient('/auth/me');
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return apiClient('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Logout
  logout: () => {
    removeToken();
    window.location.href = '/';
  },
};

// Subscribers API
export const subscribersAPI = {
  // Get all subscribers with pagination and filters
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/subscribers?${queryString}`);
  },

  // Get subscriber by ID
  getById: async (id) => {
    return apiClient(`/subscribers/${id}`);
  },

  // Create subscriber
  create: async (subscriberData) => {
    return apiClient('/subscribers', {
      method: 'POST',
      body: JSON.stringify(subscriberData),
    });
  },

  // Update subscriber
  update: async (id, subscriberData) => {
    return apiClient(`/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subscriberData),
    });
  },

  // Soft delete subscriber
  delete: async (id) => {
    return apiClient(`/subscribers/${id}`, {
      method: 'DELETE',
    });
  },

  // Restore deleted subscriber
  restore: async (id) => {
    return apiClient(`/subscribers/${id}/restore`, {
      method: 'POST',
    });
  },

  // Get statistics
  getStats: async () => {
    return apiClient('/subscribers/stats');
  },

  // Get subscribers by year
  getByYear: async (year) => {
    return apiClient(`/subscribers/year/${year}`);
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default apiClient;
