const cron = require('node-cron');
const { GoogleAdsAccount } = require('../models');
const googleAdsService = require('../services/googleAdsService');
const logger = require('../utils/logger');

// Run token refresh check every hour
cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Starting token refresh check...');

    const accounts = await GoogleAdsAccount.findAll({
      where: { 
        isActive: true,
        'settings.autoRefreshTokens': true
      }
    });

    let refreshedCount = 0;
    let errorCount = 0;

    for (const account of accounts) {
      try {
        if (account.needsTokenRefresh()) {
          await googleAdsService.refreshAccessToken(account);
          refreshedCount++;
          logger.info(`Token refreshed for account: ${account.customerId}`);
        }
      } catch (error) {
        errorCount++;
        logger.error(`Failed to refresh token for account ${account.customerId}:`, error);
      }
    }

    logger.info(`Token refresh check completed. Refreshed: ${refreshedCount}, Errors: ${errorCount}`);
  } catch (error) {
    logger.error('Error in token refresh cron job:', error);
  }
});

// Run campaign data sync every 4 hours
cron.schedule('0 */4 * * *', async () => {
  try {
    logger.info('Starting campaign data sync...');

    const accounts = await GoogleAdsAccount.findAll({
      where: { 
        isActive: true 
      }
    });

    let syncedCount = 0;
    let errorCount = 0;

    for (const account of accounts) {
      try {
        const campaignCount = await googleAdsService.syncCampaignData(account.id);
        syncedCount += campaignCount;
        logger.info(`Synced ${campaignCount} campaigns for account: ${account.customerId}`);
      } catch (error) {
        errorCount++;
        logger.error(`Failed to sync campaigns for account ${account.customerId}:`, error);
      }
    }

    logger.info(`Campaign sync completed. Synced: ${syncedCount} campaigns, Errors: ${errorCount}`);
  } catch (error) {
    logger.error('Error in campaign sync cron job:', error);
  }
});

// Cleanup old log files (keep last 30 days)
cron.schedule('0 2 * * *', async () => {
  try {
    const fs = require('fs');
    const path = require('path');
    const logDir = path.join(__dirname, '../../../logs');

    if (fs.existsSync(logDir)) {
      const files = fs.readdirSync(logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      let deletedCount = 0;

      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      }

      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} old log files`);
      }
    }
  } catch (error) {
    logger.error('Error in log cleanup cron job:', error);
  }
});

logger.info('Cron jobs initialized successfully');