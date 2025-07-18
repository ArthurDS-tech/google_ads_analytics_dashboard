const express = require('express');
const { auth } = require('../middleware/auth');
const googleAdsService = require('../services/googleAdsService');
const { GoogleAdsAccount } = require('../models');
const { validateGoogleAdsAccount } = require('../utils/validators');

const router = express.Router();

// Get all Google Ads accounts for user
router.get('/accounts', auth, async (req, res, next) => {
  try {
    const accounts = await GoogleAdsAccount.findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ['accessToken', 'refreshToken', 'clientSecret'] }
    });
    res.json(accounts);
  } catch (error) {
    next(error);
  }
});

// Add new Google Ads account
router.post('/accounts', auth, validateGoogleAdsAccount, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.create({
      ...req.body,
      userId: req.user.id
    });

    // Remove sensitive data from response
    const accountResponse = account.toJSON();
    delete accountResponse.accessToken;
    delete accountResponse.refreshToken;
    delete accountResponse.clientSecret;

    res.status(201).json(accountResponse);
  } catch (error) {
    next(error);
  }
});

// Update Google Ads account
router.put('/accounts/:id', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const allowedFields = ['accountName', 'isActive', 'settings'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await account.update(updateData);

    // Remove sensitive data from response
    const accountResponse = account.toJSON();
    delete accountResponse.accessToken;
    delete accountResponse.refreshToken;
    delete accountResponse.clientSecret;

    res.json(accountResponse);
  } catch (error) {
    next(error);
  }
});

// Delete Google Ads account
router.delete('/accounts/:id', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await account.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get campaigns for a specific account
router.get('/accounts/:id/campaigns', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const filters = {};
    if (req.query.startDate && req.query.endDate) {
      filters.dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
    }

    const campaigns = await googleAdsService.getCampaigns(account.id, filters);
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

// Get keywords for a specific account
router.get('/accounts/:id/keywords', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const filters = {};
    if (req.query.startDate && req.query.endDate) {
      filters.dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
    }

    const keywords = await googleAdsService.getKeywords(
      account.id,
      req.query.campaignId,
      filters
    );
    res.json(keywords);
  } catch (error) {
    next(error);
  }
});

// Get account metrics
router.get('/accounts/:id/metrics', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const dateRange = {};
    if (req.query.startDate && req.query.endDate) {
      dateRange.startDate = req.query.startDate;
      dateRange.endDate = req.query.endDate;
    }

    const metrics = await googleAdsService.getAccountMetrics(account.id, dateRange);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

// Get geographic performance
router.get('/accounts/:id/geographic', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const filters = {};
    if (req.query.startDate && req.query.endDate) {
      filters.dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
    }

    const geographic = await googleAdsService.getGeographicPerformance(account.id, filters);
    res.json(geographic);
  } catch (error) {
    next(error);
  }
});

// Sync campaign data
router.post('/accounts/:id/sync', auth, async (req, res, next) => {
  try {
    const account = await GoogleAdsAccount.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const syncedCount = await googleAdsService.syncCampaignData(account.id);
    res.json({ 
      message: `Synced ${syncedCount} campaigns successfully`,
      syncedCount 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;