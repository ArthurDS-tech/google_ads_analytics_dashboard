import apiClient from '../utils/apiClient';

class GoogleAdsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Cache management
  getCacheKey(method, params) {
    return `${method}_${JSON.stringify(params)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Google Ads Account management
  async getAccounts() {
    try {
      const cacheKey = this.getCacheKey('getAccounts', {});
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const accounts = await apiClient.getGoogleAdsAccounts();
      this.setCache(cacheKey, accounts);
      return accounts;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch Google Ads accounts');
    }
  }

  async addAccount(accountData) {
    try {
      const account = await apiClient.addGoogleAdsAccount(accountData);
      this.clearCache(); // Clear cache after modification
      return account;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add Google Ads account');
    }
  }

  async updateAccount(accountId, accountData) {
    try {
      const account = await apiClient.updateGoogleAdsAccount(accountId, accountData);
      this.clearCache(); // Clear cache after modification
      return account;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update Google Ads account');
    }
  }

  async deleteAccount(accountId) {
    try {
      const result = await apiClient.deleteGoogleAdsAccount(accountId);
      this.clearCache(); // Clear cache after modification
      return result;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete Google Ads account');
    }
  }

  // Campaign management
  async getCampaigns(accountId, params = {}) {
    try {
      const cacheKey = this.getCacheKey('getCampaigns', { accountId, ...params });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const campaigns = await apiClient.getCampaigns(accountId, params);
      this.setCache(cacheKey, campaigns);
      return campaigns;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch campaigns');
    }
  }

  async syncCampaigns(accountId) {
    try {
      const result = await apiClient.syncCampaigns(accountId);
      this.clearCache(); // Clear cache after sync
      return result;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to sync campaigns');
    }
  }

  // Keywords management
  async getKeywords(accountId, params = {}) {
    try {
      const cacheKey = this.getCacheKey('getKeywords', { accountId, ...params });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const keywords = await apiClient.getKeywords(accountId, params);
      this.setCache(cacheKey, keywords);
      return keywords;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch keywords');
    }
  }

  // Metrics and performance
  async getAccountMetrics(accountId, params = {}) {
    try {
      const cacheKey = this.getCacheKey('getAccountMetrics', { accountId, ...params });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const metrics = await apiClient.getAccountMetrics(accountId, params);
      this.setCache(cacheKey, metrics);
      return metrics;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch account metrics');
    }
  }

  async getGeographicPerformance(accountId, params = {}) {
    try {
      const cacheKey = this.getCacheKey('getGeographicPerformance', { accountId, ...params });
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const geographic = await apiClient.getGeographicPerformance(accountId, params);
      this.setCache(cacheKey, geographic);
      return geographic;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch geographic performance');
    }
  }

  // Dashboard data
  async getDashboardOverview(params = {}) {
    try {
      const cacheKey = this.getCacheKey('getDashboardOverview', params);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const overview = await apiClient.getDashboardOverview(params);
      this.setCache(cacheKey, overview);
      return overview;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard overview');
    }
  }

  async getPerformanceData(params = {}) {
    try {
      const cacheKey = this.getCacheKey('getPerformanceData', params);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const performance = await apiClient.getPerformanceData(params);
      this.setCache(cacheKey, performance);
      return performance;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch performance data');
    }
  }

  async getTopCampaigns(params = {}) {
    try {
      const cacheKey = this.getCacheKey('getTopCampaigns', params);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const campaigns = await apiClient.getTopCampaigns(params);
      this.setCache(cacheKey, campaigns);
      return campaigns;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch top campaigns');
    }
  }

  async getAlerts(params = {}) {
    try {
      const alerts = await apiClient.getAlerts(params);
      return alerts;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch alerts');
    }
  }

  // Utility methods
  formatCurrency(amount, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
  }

  formatPercentage(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  }

  calculateCTR(clicks, impressions) {
    if (impressions === 0) return 0;
    return (clicks / impressions) * 100;
  }

  calculateCPC(cost, clicks) {
    if (clicks === 0) return 0;
    return cost / clicks;
  }

  calculateROAS(conversionValue, cost) {
    if (cost === 0) return 0;
    return conversionValue / cost;
  }

  calculateConversionRate(conversions, clicks) {
    if (clicks === 0) return 0;
    return (conversions / clicks) * 100;
  }

  // Date range helpers
  getDateRange(period) {
    const today = new Date();
    const startDate = new Date(today);
    
    switch (period) {
      case '7d':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        startDate.setDate(today.getDate() - 7);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  }

  // Export data
  async exportData(type, params = {}) {
    try {
      let data;
      
      switch (type) {
        case 'campaigns':
          data = await this.getCampaigns(params.accountId, params);
          break;
        case 'keywords':
          data = await this.getKeywords(params.accountId, params);
          break;
        case 'overview':
          data = await this.getDashboardOverview(params);
          break;
        default:
          throw new Error('Invalid export type');
      }

      // Convert to CSV
      const csv = this.convertToCSV(data);
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }
}

export default new GoogleAdsService();