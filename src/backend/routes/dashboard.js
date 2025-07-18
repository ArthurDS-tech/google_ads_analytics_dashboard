const express = require('express');
const { auth } = require('../middleware/auth');
const { GoogleAdsAccount, Campaign } = require('../models');
const googleAdsService = require('../services/googleAdsService');
const { Op } = require('sequelize');

const router = express.Router();

// Get dashboard overview data
router.get('/overview', auth, async (req, res, next) => {
  try {
    const { startDate, endDate, accountId } = req.query;

    // Get user's accounts
    const accountsQuery = {
      where: { userId: req.user.id, isActive: true }
    };

    if (accountId) {
      accountsQuery.where.id = accountId;
    }

    const accounts = await GoogleAdsAccount.findAll(accountsQuery);

    if (accounts.length === 0) {
      return res.json({
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        averageCTR: 0,
        averageROAS: 0,
        activeCampaigns: 0,
        activeKeywords: 0,
        accounts: []
      });
    }

    // Aggregate metrics from all accounts
    let totalMetrics = {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalConversionValue: 0,
      activeCampaigns: 0,
      activeKeywords: 0
    };

    const accountsData = [];

    for (const account of accounts) {
      try {
        const dateRange = {};
        if (startDate && endDate) {
          dateRange.startDate = startDate;
          dateRange.endDate = endDate;
        }

        const metrics = await googleAdsService.getAccountMetrics(account.id, dateRange);
        
        if (metrics) {
          totalMetrics.totalSpend += metrics.cost;
          totalMetrics.totalImpressions += metrics.impressions;
          totalMetrics.totalClicks += metrics.clicks;
          totalMetrics.totalConversions += metrics.conversions;
          totalMetrics.totalConversionValue += metrics.conversionValue;
        }

        const campaigns = await googleAdsService.getCampaigns(account.id, { dateRange });
        const keywords = await googleAdsService.getKeywords(account.id, null, { dateRange });

        totalMetrics.activeCampaigns += campaigns.filter(c => c.status === 'ENABLED').length;
        totalMetrics.activeKeywords += keywords.length;

        accountsData.push({
          id: account.id,
          name: account.accountName,
          customerId: account.customerId,
          lastSync: account.lastSync,
          metrics: metrics || {},
          campaignCount: campaigns.length,
          keywordCount: keywords.length
        });
      } catch (error) {
        console.error(`Error fetching data for account ${account.customerId}:`, error);
      }
    }

    // Calculate averages
    const averageCTR = totalMetrics.totalImpressions > 0 
      ? (totalMetrics.totalClicks / totalMetrics.totalImpressions) * 100 
      : 0;

    const averageROAS = totalMetrics.totalSpend > 0 
      ? totalMetrics.totalConversionValue / totalMetrics.totalSpend 
      : 0;

    const averageCPC = totalMetrics.totalClicks > 0 
      ? totalMetrics.totalSpend / totalMetrics.totalClicks 
      : 0;

    const conversionRate = totalMetrics.totalClicks > 0 
      ? (totalMetrics.totalConversions / totalMetrics.totalClicks) * 100 
      : 0;

    res.json({
      totalSpend: totalMetrics.totalSpend,
      totalImpressions: totalMetrics.totalImpressions,
      totalClicks: totalMetrics.totalClicks,
      totalConversions: totalMetrics.totalConversions,
      totalConversionValue: totalMetrics.totalConversionValue,
      averageCTR: averageCTR,
      averageROAS: averageROAS,
      averageCPC: averageCPC,
      conversionRate: conversionRate,
      activeCampaigns: totalMetrics.activeCampaigns,
      activeKeywords: totalMetrics.activeKeywords,
      accounts: accountsData
    });
  } catch (error) {
    next(error);
  }
});

// Get performance chart data
router.get('/performance', auth, async (req, res, next) => {
  try {
    const { startDate, endDate, accountId, metric = 'cost' } = req.query;

    const accountsQuery = {
      where: { userId: req.user.id, isActive: true }
    };

    if (accountId) {
      accountsQuery.where.id = accountId;
    }

    const accounts = await GoogleAdsAccount.findAll(accountsQuery);

    const performanceData = [];
    
    // Generate daily data for the date range
    const start = new Date(startDate || Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate || Date.now());
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      let dayTotal = 0;

      for (const account of accounts) {
        try {
          const dateRange = { startDate: dateStr, endDate: dateStr };
          const metrics = await googleAdsService.getAccountMetrics(account.id, dateRange);
          
          if (metrics) {
            dayTotal += metrics[metric] || 0;
          }
        } catch (error) {
          console.error(`Error fetching performance data for account ${account.customerId}:`, error);
        }
      }

      performanceData.push({
        date: dateStr,
        value: dayTotal
      });
    }

    res.json(performanceData);
  } catch (error) {
    next(error);
  }
});

// Get top campaigns
router.get('/top-campaigns', auth, async (req, res, next) => {
  try {
    const { startDate, endDate, accountId, limit = 10 } = req.query;

    const accountsQuery = {
      where: { userId: req.user.id, isActive: true }
    };

    if (accountId) {
      accountsQuery.where.id = accountId;
    }

    const accounts = await GoogleAdsAccount.findAll(accountsQuery);

    let allCampaigns = [];

    for (const account of accounts) {
      try {
        const dateRange = {};
        if (startDate && endDate) {
          dateRange.startDate = startDate;
          dateRange.endDate = endDate;
        }

        const campaigns = await googleAdsService.getCampaigns(account.id, { dateRange });
        
        allCampaigns = allCampaigns.concat(
          campaigns.map(campaign => ({
            ...campaign,
            accountName: account.accountName,
            accountId: account.id
          }))
        );
      } catch (error) {
        console.error(`Error fetching campaigns for account ${account.customerId}:`, error);
      }
    }

    // Sort by cost and take top campaigns
    const topCampaigns = allCampaigns
      .sort((a, b) => b.metrics.cost - a.metrics.cost)
      .slice(0, parseInt(limit));

    res.json(topCampaigns);
  } catch (error) {
    next(error);
  }
});

// Get alerts and notifications
router.get('/alerts', auth, async (req, res, next) => {
  try {
    const accounts = await GoogleAdsAccount.findAll({
      where: { userId: req.user.id, isActive: true }
    });

    const alerts = [];

    for (const account of accounts) {
      try {
        // Check for token expiration
        if (account.needsTokenRefresh()) {
          alerts.push({
            type: 'warning',
            title: 'Token Expiring Soon',
            message: `Access token for ${account.accountName} will expire soon`,
            accountId: account.id,
            timestamp: new Date()
          });
        }

        // Check for stale data
        const daysSinceSync = account.lastSync 
          ? Math.floor((Date.now() - account.lastSync) / (24 * 60 * 60 * 1000))
          : 999;

        if (daysSinceSync > 1) {
          alerts.push({
            type: 'info',
            title: 'Data Sync Needed',
            message: `${account.accountName} hasn't been synced in ${daysSinceSync} days`,
            accountId: account.id,
            timestamp: new Date()
          });
        }

        // Check for high spend campaigns
        const campaigns = await googleAdsService.getCampaigns(account.id);
        const highSpendCampaigns = campaigns.filter(c => c.metrics.cost > 1000);

        if (highSpendCampaigns.length > 0) {
          alerts.push({
            type: 'info',
            title: 'High Spend Detected',
            message: `${highSpendCampaigns.length} campaigns with high spend in ${account.accountName}`,
            accountId: account.id,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error(`Error checking alerts for account ${account.customerId}:`, error);
      }
    }

    res.json(alerts.sort((a, b) => b.timestamp - a.timestamp));
  } catch (error) {
    next(error);
  }
});

module.exports = router;