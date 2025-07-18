const express = require('express');
const { auth } = require('../middleware/auth');
const reportService = require('../services/reportService');
const exportService = require('../services/exportService');
const logger = require('../utils/logger');

const router = express.Router();

// Get available report templates
router.get('/templates', auth, async (req, res, next) => {
  try {
    const templates = reportService.getAvailableTemplates();
    res.json(templates);
  } catch (error) {
    next(error);
  }
});

// Generate a new report
router.post('/generate', auth, async (req, res, next) => {
  try {
    const { templateId, config } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const report = await reportService.generateReport(req.user.id, templateId, config);
    
    res.json({
      success: true,
      report: {
        id: report.id,
        templateId: report.templateId,
        templateName: report.templateName,
        generatedAt: report.generatedAt,
        config: report.config,
        summary: report.summary,
        dataCount: report.data.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get report data
router.get('/:reportId', auth, async (req, res, next) => {
  try {
    const { reportId } = req.params;
    
    // In a real application, this would fetch from a database
    // For now, we'll regenerate the report
    const report = await reportService.generateReport(req.user.id, 'campaign-overview', {});
    
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// Get saved reports
router.get('/', auth, async (req, res, next) => {
  try {
    const { status, template, limit } = req.query;
    
    const options = {};
    if (status) options.status = status;
    if (template) options.template = template;
    if (limit) options.limit = parseInt(limit);
    
    const reports = await reportService.getSavedReports(req.user.id, options);
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Schedule a report
router.post('/schedule', auth, async (req, res, next) => {
  try {
    const { templateId, config, schedule } = req.body;
    
    if (!templateId || !schedule) {
      return res.status(400).json({ error: 'Template ID and schedule are required' });
    }

    const scheduledReport = await reportService.scheduleReport(
      req.user.id,
      templateId,
      config,
      schedule
    );
    
    res.json({
      success: true,
      scheduledReport
    });
  } catch (error) {
    next(error);
  }
});

// Export report
router.post('/:reportId/export', auth, async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { format, options } = req.body;
    
    if (!format) {
      return res.status(400).json({ error: 'Export format is required' });
    }

    // Get report data
    const reportData = await reportService.generateReport(req.user.id, 'campaign-overview', {});
    
    // Export the report
    const exportResult = await exportService.exportReport(reportData, format, options);
    
    res.json({
      success: true,
      export: {
        id: exportResult.id,
        format: exportResult.format,
        fileName: exportResult.fileName,
        size: exportResult.size,
        downloadUrl: exportResult.downloadUrl,
        expiresAt: exportResult.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Bulk export multiple reports
router.post('/bulk-export', auth, async (req, res, next) => {
  try {
    const { reportIds, format, options } = req.body;
    
    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ error: 'Report IDs array is required' });
    }
    
    if (!format) {
      return res.status(400).json({ error: 'Export format is required' });
    }

    const bulkExport = await exportService.bulkExport(reportIds, format, options);
    
    res.json({
      success: true,
      bulkExport
    });
  } catch (error) {
    next(error);
  }
});

// Get export formats
router.get('/export/formats', auth, async (req, res, next) => {
  try {
    const formats = exportService.getSupportedFormats();
    res.json(formats);
  } catch (error) {
    next(error);
  }
});

// Download export file
router.get('/exports/:exportId', auth, async (req, res, next) => {
  try {
    const { exportId } = req.params;
    
    // In a real application, this would fetch the file from storage
    // For now, we'll return a mock response
    res.json({
      success: true,
      message: 'Export file would be downloaded here',
      exportId
    });
  } catch (error) {
    next(error);
  }
});

// Delete a report
router.delete('/:reportId', auth, async (req, res, next) => {
  try {
    const { reportId } = req.params;
    
    // In a real application, this would delete from database
    logger.info(`Deleting report: ${reportId}`);
    
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Duplicate a report
router.post('/:reportId/duplicate', auth, async (req, res, next) => {
  try {
    const { reportId } = req.params;
    
    // In a real application, this would duplicate the report
    logger.info(`Duplicating report: ${reportId}`);
    
    res.json({
      success: true,
      message: 'Report duplicated successfully',
      newReportId: `${reportId}_copy_${Date.now()}`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;