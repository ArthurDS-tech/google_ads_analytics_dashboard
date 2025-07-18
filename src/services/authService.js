import apiClient from '../utils/apiClient';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  // Authentication state management
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  // Get current user from storage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        return this.currentUser;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
      }
    }
    return null;
  }

  // Set current user and notify listeners
  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.notify();
  }

  // Login
  async login(email, password) {
    try {
      const response = await apiClient.login(email, password);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Set current user
      this.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await apiClient.register(userData);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Set current user
      this.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  // Logout
  async logout() {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear current user
      this.setCurrentUser(null);
    }
  }

  // Update profile
  async updateProfile(userData) {
    try {
      const response = await apiClient.updateProfile(userData);
      this.setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Password change failed');
    }
  }

  // Refresh current user data
  async refreshUser() {
    try {
      const response = await apiClient.getCurrentUser();
      this.setCurrentUser(response.user);
      return response.user;
    } catch (error) {
      console.error('Error refreshing user:', error);
      this.logout();
      throw error;
    }
  }

  // Initialize auth state
  async initialize() {
    if (this.isAuthenticated()) {
      try {
        await this.refreshUser();
      } catch (error) {
        console.error('Error initializing auth:', error);
        this.logout();
      }
    }
  }

  // Get user preferences
  getUserPreferences() {
    const user = this.getCurrentUser();
    return user?.preferences || {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'dd/MM/yyyy',
      currency: 'BRL'
    };
  }

  // Update user preferences
  async updatePreferences(preferences) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updatedPreferences = {
      ...user.preferences,
      ...preferences
    };

    return this.updateProfile({ preferences: updatedPreferences });
  }

  // Check if user has role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Get user's full name
  getFullName() {
    const user = this.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  // Get user's initials
  getInitials() {
    const user = this.getCurrentUser();
    return user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';
  }
}

export default new AuthService();