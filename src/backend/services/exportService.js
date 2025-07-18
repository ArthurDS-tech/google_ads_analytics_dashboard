const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

class ExportService {
  constructor() {
    this.exportFormats = ['pdf', 'xlsx', 'csv', 'json'];
    this.maxExportSize = 10000; // Maximum number of records per export
  }

  async exportReport(reportData, format, options = {}) {
    try {
      if (!this.exportFormats.includes(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      if (reportData.data.length > this.maxExportSize) {
        throw new Error(`Export size exceeds maximum limit of ${this.maxExportSize} records`);
      }

      logger.info(`Exporting report to ${format} format`);

      const exportedData = await this.generateExport(reportData, format, options);
      
      const exportInfo = {
        id: `export_${Date.now()}`,
        format,
        reportId: reportData.id,
        fileName: this.generateFileName(reportData, format),
        size: exportedData.length,
        createdAt: new Date(),
        downloadUrl: `/api/exports/${exportedData.id}`, // This would be a temporary URL
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      logger.info(`Export completed: ${exportInfo.id}`);
      return { ...exportInfo, data: exportedData };
    } catch (error) {
      logger.error('Error exporting report:', error);
      throw error;
    }
  }

  async generateExport(reportData, format, options) {
    switch (format) {
      case 'csv':
        return this.generateCSV(reportData, options);
      case 'xlsx':
        return this.generateExcel(reportData, options);
      case 'pdf':
        return this.generatePDF(reportData, options);
      case 'json':
        return this.generateJSON(reportData, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  generateCSV(reportData, options) {
    const { data, templateName } = reportData;
    
    if (data.length === 0) {
      return 'No data available';
    }

    // Get all unique keys from the data
    const allKeys = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'metrics') {
          allKeys.add(key);
        }
        // Add metrics keys if they exist
        if (item.metrics && typeof item.metrics === 'object') {
          Object.keys(item.metrics).forEach(metricKey => {
            allKeys.add(`metrics.${metricKey}`);
          });
        }
      });
    });

    const headers = Array.from(allKeys).sort();
    const csvRows = [];

    // Add header row
    csvRows.push(headers.map(h => `"${h}"`).join(','));

    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        let value = '';
        if (header.startsWith('metrics.')) {
          const metricKey = header.replace('metrics.', '');
          value = item.metrics?.[metricKey] || '';
        } else {
          value = item[header] || '';
        }
        
        // Handle numbers and strings
        if (typeof value === 'number') {
          return value.toString();
        }
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  generateExcel(reportData, options) {
    // This would use a library like xlsx to generate Excel files
    // For now, returning a mock structure
    const workbook = {
      SheetNames: ['Report Data', 'Summary'],
      Sheets: {
        'Report Data': this.dataToSheet(reportData.data),
        'Summary': this.summaryToSheet(reportData.summary)
      }
    };

    return JSON.stringify(workbook, null, 2);
  }

  generatePDF(reportData, options) {
    // This would use a library like jsPDF to generate PDF files
    // For now, returning a mock PDF structure
    const pdfContent = {
      title: reportData.templateName,
      generatedAt: reportData.generatedAt,
      summary: reportData.summary,
      data: reportData.data.slice(0, 50), // Limit for PDF
      pageCount: Math.ceil(reportData.data.length / 50)
    };

    return JSON.stringify(pdfContent, null, 2);
  }

  generateJSON(reportData, options) {
    const jsonData = {
      ...reportData,
      exportedAt: new Date(),
      format: 'json'
    };

    return JSON.stringify(jsonData, null, 2);
  }

  dataToSheet(data) {
    if (!data || data.length === 0) {
      return { '!ref': 'A1' };
    }

    const sheet = {};
    const headers = Object.keys(data[0]);
    const range = `A1:${String.fromCharCode(65 + headers.length - 1)}${data.length + 1}`;

    // Add headers
    headers.forEach((header, index) => {
      const cellRef = String.fromCharCode(65 + index) + '1';
      sheet[cellRef] = { v: header, t: 's' };
    });

    // Add data
    data.forEach((row, rowIndex) => {
      headers.forEach((header, colIndex) => {
        const cellRef = String.fromCharCode(65 + colIndex) + (rowIndex + 2);
        const value = row[header];
        
        if (typeof value === 'number') {
          sheet[cellRef] = { v: value, t: 'n' };
        } else {
          sheet[cellRef] = { v: value?.toString() || '', t: 's' };
        }
      });
    });

    sheet['!ref'] = range;
    return sheet;
  }

  summaryToSheet(summary) {
    if (!summary) {
      return { '!ref': 'A1' };
    }

    const sheet = {};
    let rowIndex = 1;

    sheet['A1'] = { v: 'Metric', t: 's' };
    sheet['B1'] = { v: 'Value', t: 's' };

    Object.keys(summary).forEach(key => {
      if (key === 'totalRecords') {
        rowIndex++;
        sheet[`A${rowIndex}`] = { v: 'Total Records', t: 's' };
        sheet[`B${rowIndex}`] = { v: summary[key], t: 'n' };
      } else if (typeof summary[key] === 'object' && summary[key].total !== undefined) {
        rowIndex++;
        sheet[`A${rowIndex}`] = { v: `${key.charAt(0).toUpperCase() + key.slice(1)} Total`, t: 's' };
        sheet[`B${rowIndex}`] = { v: summary[key].total, t: 'n' };
      }
    });

    sheet['!ref'] = `A1:B${rowIndex}`;
    return sheet;
  }

  generateFileName(reportData, format) {
    const templateName = reportData.templateName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    return `${templateName}_${timestamp}.${format}`;
  }

  async bulkExport(reportIds, format, options = {}) {
    try {
      logger.info(`Starting bulk export for ${reportIds.length} reports`);
      
      const exports = [];
      
      for (const reportId of reportIds) {
        // In a real application, you would fetch the report data from storage
        const reportData = await this.getReportData(reportId);
        if (reportData) {
          const exportResult = await this.exportReport(reportData, format, options);
          exports.push(exportResult);
        }
      }

      logger.info(`Bulk export completed: ${exports.length} files generated`);
      return {
        id: `bulk_export_${Date.now()}`,
        exports,
        totalFiles: exports.length,
        createdAt: new Date(),
        downloadUrl: `/api/exports/bulk/${exports.map(e => e.id).join(',')}`
      };
    } catch (error) {
      logger.error('Error in bulk export:', error);
      throw error;
    }
  }

  async getReportData(reportId) {
    // Mock implementation - in real app, this would fetch from database
    return {
      id: reportId,
      templateName: 'Sample Report',
      generatedAt: new Date(),
      data: [
        { name: 'Campaign 1', impressions: 1000, clicks: 50, cost: 100 },
        { name: 'Campaign 2', impressions: 2000, clicks: 100, cost: 200 }
      ],
      summary: {
        totalRecords: 2,
        cost: { total: 300, average: 150 },
        impressions: { total: 3000, average: 1500 }
      }
    };
  }

  getSupportedFormats() {
    return this.exportFormats.map(format => ({
      format,
      description: this.getFormatDescription(format),
      mimeType: this.getFormatMimeType(format)
    }));
  }

  getFormatDescription(format) {
    const descriptions = {
      pdf: 'Portable Document Format - Good for sharing and printing',
      xlsx: 'Microsoft Excel - Best for data analysis',
      csv: 'Comma Separated Values - Universal format, works with any spreadsheet',
      json: 'JavaScript Object Notation - For developers and API integration'
    };
    return descriptions[format] || 'Unknown format';
  }

  getFormatMimeType(format) {
    const mimeTypes = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      json: 'application/json'
    };
    return mimeTypes[format] || 'application/octet-stream';
  }
}

module.exports = new ExportService();