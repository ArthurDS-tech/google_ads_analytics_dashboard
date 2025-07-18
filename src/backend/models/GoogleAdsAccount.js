const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GoogleAdsAccount = sequelize.define('GoogleAdsAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'BRL'
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'America/Sao_Paulo'
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    developerToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientSecret: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastSync: {
      type: DataTypes.DATE
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        autoRefreshTokens: true,
        syncInterval: 3600, // 1 hour in seconds
        enabledReports: ['campaign', 'keyword', 'ad_group']
      }
    }
  });

  GoogleAdsAccount.prototype.isTokenExpired = function() {
    return new Date() >= this.tokenExpiry;
  };

  GoogleAdsAccount.prototype.needsTokenRefresh = function() {
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return new Date() >= (this.tokenExpiry - bufferTime);
  };

  return GoogleAdsAccount;
};