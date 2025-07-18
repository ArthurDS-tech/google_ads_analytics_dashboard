const { GoogleAdsApi } = require('google-ads-api');
const { GoogleAdsAccount, Campaign } = require('../models');
const logger = require('../utils/logger');

class GoogleAdsService {
  constructor() {
    this.clients = new Map();
  }

  async getClient(googleAdsAccountId) {
    if (this.clients.has(googleAdsAccountId)) {
      return this.clients.get(googleAdsAccountId);
    }

    const account = await GoogleAdsAccount.findByPk(googleAdsAccountId);
    if (!account) {
      throw new Error('Google Ads account not found');
    }

    // Check if token needs refresh
    if (account.needsTokenRefresh()) {
      await this.refreshAccessToken(account);
    }

    const client = new GoogleAdsApi({
      client_id: account.clientId,
      client_secret: account.clientSecret,
      developer_token: account.developerToken,
      refresh_token: account.refreshToken
    });

    this.clients.set(googleAdsAccountId, client);
    return client;
  }

  async refreshAccessToken(account) {
    try {
      const client = new GoogleAdsApi({
        client_id: account.clientId,
        client_secret: account.clientSecret,
        developer_token: account.developerToken,
        refresh_token: account.refreshToken
      });

      const tokens = await client.refreshAccessToken();
      
      await account.update({
        accessToken: tokens.access_token,
        tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000)
      });

      logger.info(`Token refreshed for account ${account.customerId}`);
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  async getCampaigns(googleAdsAccountId, filters = {}) {
    try {
      const client = await this.getClient(googleAdsAccountId);
      const account = await GoogleAdsAccount.findByPk(googleAdsAccountId);
      
      const customer = client.Customer({
        customer_id: account.customerId,
        refresh_token: account.refreshToken
      });

      const campaigns = await customer.query(`
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.campaign_budget,
          campaign.start_date,
          campaign.end_date,
          campaign.advertising_channel_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_cpm
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ${filters.dateRange ? `AND segments.date >= '${filters.dateRange.startDate}' AND segments.date <= '${filters.dateRange.endDate}'` : ''}
        ORDER BY metrics.cost_micros DESC
      `);

      return campaigns.map(campaign => ({
        id: campaign.campaign.id,
        name: campaign.campaign.name,
        status: campaign.campaign.status,
        type: campaign.campaign.advertising_channel_type,
        startDate: campaign.campaign.start_date,
        endDate: campaign.campaign.end_date,
        budget: campaign.campaign.campaign_budget,
        metrics: {
          impressions: parseInt(campaign.metrics.impressions) || 0,
          clicks: parseInt(campaign.metrics.clicks) || 0,
          cost: parseFloat(campaign.metrics.cost_micros) / 1000000 || 0,
          conversions: parseFloat(campaign.metrics.conversions) || 0,
          conversionValue: parseFloat(campaign.metrics.conversions_value) || 0,
          ctr: parseFloat(campaign.metrics.ctr) || 0,
          cpc: parseFloat(campaign.metrics.average_cpc) / 1000000 || 0,
          cpm: parseFloat(campaign.metrics.average_cpm) / 1000000 || 0
        }
      }));
    } catch (error) {
      logger.error('Error fetching campaigns:', error);
      throw new Error('Failed to fetch campaigns from Google Ads');
    }
  }

  async getKeywords(googleAdsAccountId, campaignId = null, filters = {}) {
    try {
      const client = await this.getClient(googleAdsAccountId);
      const account = await GoogleAdsAccount.findByPk(googleAdsAccountId);
      
      const customer = client.Customer({
        customer_id: account.customerId,
        refresh_token: account.refreshToken
      });

      const whereClause = campaignId ? `AND campaign.id = ${campaignId}` : '';

      const keywords = await customer.query(`
        SELECT 
          ad_group_criterion.criterion_id,
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          ad_group_criterion.quality_info.quality_score,
          ad_group.name,
          campaign.name,
          campaign.id,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_position
        FROM keyword_view
        WHERE ad_group_criterion.type = 'KEYWORD'
        AND ad_group_criterion.status != 'REMOVED'
        ${whereClause}
        ${filters.dateRange ? `AND segments.date >= '${filters.dateRange.startDate}' AND segments.date <= '${filters.dateRange.endDate}'` : ''}
        ORDER BY metrics.cost_micros DESC
      `);

      return keywords.map(keyword => ({
        id: keyword.ad_group_criterion.criterion_id,
        text: keyword.ad_group_criterion.keyword.text,
        matchType: keyword.ad_group_criterion.keyword.match_type,
        qualityScore: keyword.ad_group_criterion.quality_info.quality_score,
        adGroup: keyword.ad_group.name,
        campaign: keyword.campaign.name,
        campaignId: keyword.campaign.id,
        metrics: {
          impressions: parseInt(keyword.metrics.impressions) || 0,
          clicks: parseInt(keyword.metrics.clicks) || 0,
          cost: parseFloat(keyword.metrics.cost_micros) / 1000000 || 0,
          conversions: parseFloat(keyword.metrics.conversions) || 0,
          conversionValue: parseFloat(keyword.metrics.conversions_value) || 0,
          ctr: parseFloat(keyword.metrics.ctr) || 0,
          cpc: parseFloat(keyword.metrics.average_cpc) / 1000000 || 0,
          avgPosition: parseFloat(keyword.metrics.average_position) || 0
        }
      }));
    } catch (error) {
      logger.error('Error fetching keywords:', error);
      throw new Error('Failed to fetch keywords from Google Ads');
    }
  }

  async getAccountMetrics(googleAdsAccountId, dateRange = {}) {
    try {
      const client = await this.getClient(googleAdsAccountId);
      const account = await GoogleAdsAccount.findByPk(googleAdsAccountId);
      
      const customer = client.Customer({
        customer_id: account.customerId,
        refresh_token: account.refreshToken
      });

      const metrics = await customer.query(`
        SELECT 
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_cpm,
          customer.currency_code
        FROM customer
        ${dateRange.startDate ? `WHERE segments.date >= '${dateRange.startDate}' AND segments.date <= '${dateRange.endDate}'` : ''}
      `);

      if (metrics.length === 0) {
        return null;
      }

      const data = metrics[0];
      return {
        impressions: parseInt(data.metrics.impressions) || 0,
        clicks: parseInt(data.metrics.clicks) || 0,
        cost: parseFloat(data.metrics.cost_micros) / 1000000 || 0,
        conversions: parseFloat(data.metrics.conversions) || 0,
        conversionValue: parseFloat(data.metrics.conversions_value) || 0,
        ctr: parseFloat(data.metrics.ctr) || 0,
        cpc: parseFloat(data.metrics.average_cpc) / 1000000 || 0,
        cpm: parseFloat(data.metrics.average_cpm) / 1000000 || 0,
        currency: data.customer.currency_code,
        roas: data.metrics.cost_micros > 0 ? (data.metrics.conversions_value / (data.metrics.cost_micros / 1000000)) : 0
      };
    } catch (error) {
      logger.error('Error fetching account metrics:', error);
      throw new Error('Failed to fetch account metrics from Google Ads');
    }
  }

  async getGeographicPerformance(googleAdsAccountId, filters = {}) {
    try {
      const client = await this.getClient(googleAdsAccountId);
      const account = await GoogleAdsAccount.findByPk(googleAdsAccountId);
      
      const customer = client.Customer({
        customer_id: account.customerId,
        refresh_token: account.refreshToken
      });

      const geographic = await customer.query(`
        SELECT 
          geographic_view.location_type,
          geographic_view.country_criterion_id,
          geographic_view.location_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value
        FROM geographic_view
        WHERE geographic_view.location_type = 'LOCATION_OF_PRESENCE'
        ${filters.dateRange ? `AND segments.date >= '${filters.dateRange.startDate}' AND segments.date <= '${filters.dateRange.endDate}'` : ''}
        ORDER BY metrics.cost_micros DESC
      `);

      return geographic.map(geo => ({
        locationId: geo.geographic_view.country_criterion_id,
        locationType: geo.geographic_view.location_type,
        metrics: {
          impressions: parseInt(geo.metrics.impressions) || 0,
          clicks: parseInt(geo.metrics.clicks) || 0,
          cost: parseFloat(geo.metrics.cost_micros) / 1000000 || 0,
          conversions: parseFloat(geo.metrics.conversions) || 0,
          conversionValue: parseFloat(geo.metrics.conversions_value) || 0
        }
      }));
    } catch (error) {
      logger.error('Error fetching geographic performance:', error);
      throw new Error('Failed to fetch geographic performance from Google Ads');
    }
  }

  async syncCampaignData(googleAdsAccountId) {
    try {
      const campaigns = await this.getCampaigns(googleAdsAccountId);
      
      for (const campaignData of campaigns) {
        await Campaign.upsert({
          campaignId: campaignData.id,
          googleAdsAccountId: googleAdsAccountId,
          name: campaignData.name,
          status: campaignData.status,
          campaignType: campaignData.type,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          metrics: campaignData.metrics,
          lastUpdated: new Date()
        });
      }

      // Update last sync time
      await GoogleAdsAccount.update(
        { lastSync: new Date() },
        { where: { id: googleAdsAccountId } }
      );

      logger.info(`Synced ${campaigns.length} campaigns for account ${googleAdsAccountId}`);
      return campaigns.length;
    } catch (error) {
      logger.error('Error syncing campaign data:', error);
      throw error;
    }
  }
}

module.exports = new GoogleAdsService();