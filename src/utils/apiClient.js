import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data;
              
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email, password) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await this.client.put('/auth/profile', userData);
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await this.client.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // Google Ads Account methods
  async getGoogleAdsAccounts() {
    const response = await this.client.get('/google-ads/accounts');
    return response.data;
  }

  async addGoogleAdsAccount(accountData) {
    const response = await this.client.post('/google-ads/accounts', accountData);
    return response.data;
  }

  async updateGoogleAdsAccount(accountId, accountData) {
    const response = await this.client.put(`/google-ads/accounts/${accountId}`, accountData);
    return response.data;
  }

  async deleteGoogleAdsAccount(accountId) {
    const response = await this.client.delete(`/google-ads/accounts/${accountId}`);
    return response.data;
  }

  // Campaign methods
  async getCampaigns(accountId, params = {}) {
    const response = await this.client.get(`/google-ads/accounts/${accountId}/campaigns`, {
      params,
    });
    return response.data;
  }

  async syncCampaigns(accountId) {
    const response = await this.client.post(`/google-ads/accounts/${accountId}/sync`);
    return response.data;
  }

  // Keywords methods
  async getKeywords(accountId, params = {}) {
    const response = await this.client.get(`/google-ads/accounts/${accountId}/keywords`, {
      params,
    });
    return response.data;
  }

  // Metrics methods
  async getAccountMetrics(accountId, params = {}) {
    const response = await this.client.get(`/google-ads/accounts/${accountId}/metrics`, {
      params,
    });
    return response.data;
  }

  async getGeographicPerformance(accountId, params = {}) {
    const response = await this.client.get(`/google-ads/accounts/${accountId}/geographic`, {
      params,
    });
    return response.data;
  }

  // Dashboard methods
  async getDashboardOverview(params = {}) {
    const response = await this.client.get('/dashboard/overview', { params });
    return response.data;
  }

  async getPerformanceData(params = {}) {
    const response = await this.client.get('/dashboard/performance', { params });
    return response.data;
  }

  async getTopCampaigns(params = {}) {
    const response = await this.client.get('/dashboard/top-campaigns', { params });
    return response.data;
  }

  async getAlerts(params = {}) {
    const response = await this.client.get('/dashboard/alerts', { params });
    return response.data;
  }

  // Generic methods
  async get(endpoint, params = {}) {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }

  async post(endpoint, data = {}) {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data = {}) {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    const response = await this.client.delete(endpoint);
    return response.data;
  }
}

export default new ApiClient();