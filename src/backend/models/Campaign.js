const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    campaignId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ENABLED', 'PAUSED', 'REMOVED'),
      allowNull: false
    },
    campaignType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY
    },
    endDate: {
      type: DataTypes.DATEONLY
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2)
    },
    budgetType: {
      type: DataTypes.STRING
    },
    targetCpa: {
      type: DataTypes.DECIMAL(10, 2)
    },
    targetRoas: {
      type: DataTypes.DECIMAL(10, 2)
    },
    biddingStrategy: {
      type: DataTypes.STRING
    },
    metrics: {
      type: DataTypes.JSON,
      defaultValue: {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        conversionValue: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0,
        conversionRate: 0
      }
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Campaign.prototype.calculateCTR = function() {
    if (this.metrics.impressions === 0) return 0;
    return (this.metrics.clicks / this.metrics.impressions) * 100;
  };

  Campaign.prototype.calculateCPC = function() {
    if (this.metrics.clicks === 0) return 0;
    return this.metrics.cost / this.metrics.clicks;
  };

  Campaign.prototype.calculateROAS = function() {
    if (this.metrics.cost === 0) return 0;
    return this.metrics.conversionValue / this.metrics.cost;
  };

  Campaign.prototype.calculateConversionRate = function() {
    if (this.metrics.clicks === 0) return 0;
    return (this.metrics.conversions / this.metrics.clicks) * 100;
  };

  return Campaign;
};