import apiClient from '../utils/apiClient';

class ReportService {
  // Get available report templates
  async getTemplates() {
    try {
      const response = await apiClient.get('/reports/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  }

  // Generate a new report
  async generateReport(templateId, config) {
    try {
      const response = await apiClient.post('/reports/generate', {
        templateId,
        config
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Get report data
  async getReport(reportId) {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  // Get saved reports
  async getSavedReports(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.template) params.append('template', options.template);
      if (options.limit) params.append('limit', options.limit);
      
      const response = await apiClient.get(`/reports?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      throw error;
    }
  }

  // Schedule a report
  async scheduleReport(templateId, config, schedule) {
    try {
      const response = await apiClient.post('/reports/schedule', {
        templateId,
        config,
        schedule
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  }

  // Export report
  async exportReport(reportId, format, options = {}) {
    try {
      const response = await apiClient.post(`/reports/${reportId}/export`, {
        format,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Bulk export reports
  async bulkExport(reportIds, format, options = {}) {
    try {
      const response = await apiClient.post('/reports/bulk-export', {
        reportIds,
        format,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk exporting reports:', error);
      throw error;
    }
  }

  // Get export formats
  async getExportFormats() {
    try {
      const response = await apiClient.get('/reports/export/formats');
      return response.data;
    } catch (error) {
      console.error('Error fetching export formats:', error);
      throw error;
    }
  }

  // Download export file
  async downloadExport(exportId) {
    try {
      const response = await apiClient.get(`/reports/exports/${exportId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading export:', error);
      throw error;
    }
  }

  // Delete a report
  async deleteReport(reportId) {
    try {
      const response = await apiClient.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  // Duplicate a report
  async duplicateReport(reportId) {
    try {
      const response = await apiClient.post(`/reports/${reportId}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating report:', error);
      throw error;
    }
  }

  // Helper method to format report data for display
  formatReportData(data, template) {
    if (!data || !Array.isArray(data)) return [];

    return data.map(item => {
      const formatted = { ...item };
      
      // Format metrics if they exist
      if (formatted.metrics) {
        Object.keys(formatted.metrics).forEach(key => {
          const value = formatted.metrics[key];
          if (typeof value === 'number') {
            // Format currency values
            if (key.includes('cost') || key.includes('value')) {
              formatted.metrics[key] = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value);
            }
            // Format percentages
            else if (key.includes('ctr') || key.includes('rate')) {
              formatted.metrics[key] = `${(value * 100).toFixed(2)}%`;
            }
            // Format regular numbers
            else {
              formatted.metrics[key] = new Intl.NumberFormat('pt-BR').format(value);
            }
          }
        });
      }
      
      return formatted;
    });
  }

  // Helper method to validate report configuration
  validateReportConfig(config) {
    const errors = [];
    
    if (config.dateRange) {
      const { startDate, endDate } = config.dateRange;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
          errors.push('Start date cannot be after end date');
        }
        
        if (start > new Date()) {
          errors.push('Start date cannot be in the future');
        }
      }
    }
    
    if (config.limit && (config.limit < 1 || config.limit > 10000)) {
      errors.push('Limit must be between 1 and 10000');
    }
    
    return errors;
  }

  // Helper method to get report preview
  async getReportPreview(templateId, config) {
    try {
      const previewConfig = {
        ...config,
        limit: 10 // Limit preview to 10 records
      };
      
      const response = await apiClient.post('/reports/generate', {
        templateId,
        config: previewConfig
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching report preview:', error);
      throw error;
    }
  }
}

export default new ReportService();