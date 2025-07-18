import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class ExportService {
  // Export data to CSV
  exportToCSV(data, filename = 'export.csv') {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      const csvContent = this.convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  // Export data to Excel
  exportToExcel(data, filename = 'export.xlsx', sheetName = 'Data') {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      const worksheet = XLSX.utils.json_to_sheet(this.flattenData(data));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Export data to PDF
  async exportToPDF(data, filename = 'export.pdf', options = {}) {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      let yPosition = 20;

      // Add title
      pdf.setFontSize(16);
      pdf.text(options.title || 'Report Export', 20, yPosition);
      yPosition += 15;

      // Add date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPosition);
      yPosition += 15;

      // Prepare table data
      const flatData = this.flattenData(data);
      if (flatData.length === 0) {
        pdf.text('No data available', 20, yPosition);
      } else {
        const headers = Object.keys(flatData[0]);
        const rows = flatData.map(item => headers.map(header => item[header]?.toString() || ''));

        // Add table
        this.addTableToPDF(pdf, headers, rows, yPosition, pageWidth, pageHeight);
      }

      pdf.save(filename);
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  // Export HTML element to PDF
  async exportElementToPDF(elementId, filename = 'report.pdf') {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting element to PDF:', error);
      throw error;
    }
  }

  // Export data to JSON
  exportToJSON(data, filename = 'export.json') {
    try {
      if (!data) {
        throw new Error('No data to export');
      }

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      saveAs(blob, filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  }

  // Helper method to convert data to CSV format
  convertToCSV(data) {
    const flatData = this.flattenData(data);
    if (flatData.length === 0) return '';

    const headers = Object.keys(flatData[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.map(header => `"${header}"`).join(','));

    // Add data rows
    flatData.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (value === null || value === undefined) return '""';
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Helper method to flatten nested data
  flattenData(data) {
    if (!Array.isArray(data)) return [];

    return data.map(item => {
      const flattened = {};
      
      const flatten = (obj, prefix = '') => {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          const newKey = prefix ? `${prefix}.${key}` : key;
          
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            flatten(value, newKey);
          } else {
            flattened[newKey] = value;
          }
        });
      };
      
      flatten(item);
      return flattened;
    });
  }

  // Helper method to add table to PDF
  addTableToPDF(pdf, headers, rows, startY, pageWidth, pageHeight) {
    const cellPadding = 3;
    const cellHeight = 8;
    const maxCellWidth = (pageWidth - 40) / headers.length;
    
    let yPosition = startY;
    
    // Add headers
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    
    headers.forEach((header, index) => {
      const xPosition = 20 + (index * maxCellWidth);
      pdf.text(header, xPosition + cellPadding, yPosition + cellPadding);
      pdf.rect(xPosition, yPosition - cellHeight, maxCellWidth, cellHeight);
    });
    
    yPosition += cellHeight;
    pdf.setFont(undefined, 'normal');
    
    // Add rows
    rows.forEach(row => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      row.forEach((cell, index) => {
        const xPosition = 20 + (index * maxCellWidth);
        const cellText = cell?.toString() || '';
        
        // Truncate long text
        const truncatedText = cellText.length > 20 ? cellText.substring(0, 17) + '...' : cellText;
        
        pdf.text(truncatedText, xPosition + cellPadding, yPosition + cellPadding);
        pdf.rect(xPosition, yPosition - cellHeight, maxCellWidth, cellHeight);
      });
      
      yPosition += cellHeight;
    });
  }

  // Get available export formats
  getSupportedFormats() {
    return [
      {
        format: 'csv',
        name: 'CSV',
        description: 'Comma-separated values, works with Excel and other spreadsheet apps',
        mimeType: 'text/csv'
      },
      {
        format: 'xlsx',
        name: 'Excel',
        description: 'Microsoft Excel format with advanced formatting',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      {
        format: 'pdf',
        name: 'PDF',
        description: 'Portable Document Format, great for sharing and printing',
        mimeType: 'application/pdf'
      },
      {
        format: 'json',
        name: 'JSON',
        description: 'JavaScript Object Notation, ideal for developers',
        mimeType: 'application/json'
      }
    ];
  }

  // Generate filename with timestamp
  generateFilename(baseName, format) {
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitizedName}_${timestamp}.${format}`;
  }

  // Validate export data
  validateExportData(data) {
    if (!data) {
      throw new Error('No data provided for export');
    }

    if (Array.isArray(data) && data.length === 0) {
      throw new Error('Empty data array provided for export');
    }

    return true;
  }

  // Get export statistics
  getExportStats(data) {
    if (!Array.isArray(data)) return null;

    const stats = {
      totalRecords: data.length,
      totalColumns: 0,
      estimatedSize: 0
    };

    if (data.length > 0) {
      const flatData = this.flattenData(data);
      if (flatData.length > 0) {
        stats.totalColumns = Object.keys(flatData[0]).length;
        stats.estimatedSize = JSON.stringify(flatData).length;
      }
    }

    return stats;
  }
}

export default new ExportService();