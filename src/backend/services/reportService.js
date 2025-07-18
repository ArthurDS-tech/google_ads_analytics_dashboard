const googleAdsService = require('./googleAdsService');
const { GoogleAdsAccount } = require('../models');
const logger = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

class ReportService {
  constructor() {
    this.reportTemplates = {
      'campaign-overview': {
        name: 'Visão Geral de Campanhas',
        description: 'Relatório completo com métricas principais',
        dataSource: 'campaigns',
        fields: ['name', 'status', 'impressions', 'clicks', 'cost', 'conversions', 'ctr', 'cpc']
      },
      'keyword-performance': {
        name: 'Performance de Palavras-chave',
        description: 'Análise detalhada de palavras-chave',
        dataSource: 'keywords',
        fields: ['text', 'matchType', 'impressions', 'clicks', 'cost', 'conversions', 'ctr', 'cpc']
      },
      'geographic-analysis': {
        name: 'Análise Geográfica',
        description: 'Performance por região',
        dataSource: 'geographic',
        fields: ['locationId', 'impressions', 'clicks', 'cost', 'conversions']
      },
      'roi-summary': {
        name: 'Resumo de ROI',
        description: 'Análise financeira completa',
        dataSource: 'metrics',
        fields: ['cost', 'conversions', 'conversionValue', 'roas', 'cpc']
      }
    };
  }

  async generateReport(userId, templateId, config) {
    try {
      const template = this.reportTemplates[templateId];
      if (!template) {
        throw new Error('Template not found');
      }

      logger.info(`Generating report for user ${userId} with template ${templateId}`);

      const accounts = await GoogleAdsAccount.findAll({
        where: { 
          userId: userId,
          isActive: true,
          ...(config.accountIds && { id: config.accountIds })
        }
      });

      if (accounts.length === 0) {
        throw new Error('No active accounts found');
      }

      const reportData = await this.collectReportData(accounts, template, config);
      
      const report = {
        id: `report_${Date.now()}`,
        templateId,
        templateName: template.name,
        generatedAt: new Date(),
        config,
        data: reportData,
        summary: this.calculateSummary(reportData, template)
      };

      logger.info(`Report generated successfully: ${report.id}`);
      return report;
    } catch (error) {
      logger.error('Error generating report:', error);
      throw error;
    }
  }

  async collectReportData(accounts, template, config) {
    const allData = [];
    const dateRange = config.dateRange || {};

    for (const account of accounts) {
      try {
        let accountData = [];

        switch (template.dataSource) {
          case 'campaigns':
            accountData = await googleAdsService.getCampaigns(account.id, { dateRange });
            break;
          case 'keywords':
            accountData = await googleAdsService.getKeywords(account.id, config.campaignId, { dateRange });
            break;
          case 'geographic':
            accountData = await googleAdsService.getGeographicPerformance(account.id, { dateRange });
            break;
          case 'metrics':
            const metrics = await googleAdsService.getAccountMetrics(account.id, dateRange);
            accountData = metrics ? [{ ...metrics, accountName: account.accountName }] : [];
            break;
        }

        // Add account information to each data row
        accountData = accountData.map(item => ({
          ...item,
          accountName: account.accountName,
          accountId: account.id,
          customerId: account.customerId
        }));

        allData.push(...accountData);
      } catch (error) {
        logger.error(`Error collecting data for account ${account.customerId}:`, error);
        // Continue with other accounts even if one fails
      }
    }

    return this.filterAndSortData(allData, template, config);
  }

  filterAndSortData(data, template, config) {
    let filteredData = data;

    // Apply filters
    if (config.filters) {
      Object.keys(config.filters).forEach(key => {
        const filterValue = config.filters[key];
        if (filterValue && filterValue !== 'all') {
          filteredData = filteredData.filter(item => {
            const itemValue = this.getNestedValue(item, key);
            return itemValue && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
          });
        }
      });
    }

    // Apply sorting
    if (config.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = this.getNestedValue(a, config.sortBy);
        const bValue = this.getNestedValue(b, config.sortBy);
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return config.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = aValue ? aValue.toString() : '';
        const bStr = bValue ? bValue.toString() : '';
        
        if (config.sortOrder === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    // Apply limit
    if (config.limit && config.limit > 0) {
      filteredData = filteredData.slice(0, config.limit);
    }

    return filteredData;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  calculateSummary(data, template) {
    if (data.length === 0) return {};

    const summary = {
      totalRecords: data.length,
      dateRange: {
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      }
    };

    // Calculate numeric summaries
    const numericFields = ['impressions', 'clicks', 'cost', 'conversions', 'conversionValue'];
    
    numericFields.forEach(field => {
      const values = data.map(item => {
        const value = this.getNestedValue(item, `metrics.${field}`) || this.getNestedValue(item, field);
        return typeof value === 'number' ? value : 0;
      });
      
      if (values.length > 0) {
        summary[field] = {
          total: values.reduce((sum, val) => sum + val, 0),
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          max: Math.max(...values),
          min: Math.min(...values)
        };
      }
    });

    // Calculate derived metrics
    if (summary.impressions && summary.clicks) {
      summary.ctr = {
        average: (summary.clicks.total / summary.impressions.total) * 100
      };
    }

    if (summary.cost && summary.clicks) {
      summary.cpc = {
        average: summary.cost.total / summary.clicks.total
      };
    }

    if (summary.conversionValue && summary.cost) {
      summary.roas = {
        average: summary.conversionValue.total / summary.cost.total
      };
    }

    return summary;
  }

  async scheduleReport(userId, templateId, config, schedule) {
    try {
      // This would typically save to a database for later processing
      const scheduledReport = {
        id: `scheduled_${Date.now()}`,
        userId,
        templateId,
        config,
        schedule,
        createdAt: new Date(),
        nextRun: this.calculateNextRun(schedule),
        status: 'scheduled'
      };

      logger.info(`Report scheduled: ${scheduledReport.id}`);
      return scheduledReport;
    } catch (error) {
      logger.error('Error scheduling report:', error);
      throw error;
    }
  }

  calculateNextRun(schedule) {
    const now = new Date();
    
    switch (schedule.frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  async getSavedReports(userId, options = {}) {
    try {
      // In a real application, this would fetch from a database
      const mockReports = [
        {
          id: 'report-1',
          name: 'Relatório Mensal - Janeiro 2025',
          description: 'Relatório completo de performance para o mês de janeiro',
          status: 'generated',
          lastModified: '2025-01-18',
          isScheduled: true,
          template: 'campaign-overview',
          createdAt: new Date('2025-01-18')
        },
        {
          id: 'report-2',
          name: 'Análise Black Friday 2024',
          description: 'Relatório específico da campanha Black Friday',
          status: 'scheduled',
          lastModified: '2025-01-15',
          isScheduled: true,
          template: 'campaign-overview',
          createdAt: new Date('2025-01-15')
        }
      ];

      return mockReports.filter(report => {
        if (options.status && report.status !== options.status) return false;
        if (options.template && report.template !== options.template) return false;
        return true;
      });
    } catch (error) {
      logger.error('Error getting saved reports:', error);
      throw error;
    }
  }

  getAvailableTemplates() {
    return Object.keys(this.reportTemplates).map(id => ({
      id,
      ...this.reportTemplates[id]
    }));
  }
}

module.exports = new ReportService();