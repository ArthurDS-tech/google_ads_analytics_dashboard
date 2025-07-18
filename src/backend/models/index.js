const sequelize = require('../config/database');
const UserModel = require('./User');
const GoogleAdsAccountModel = require('./GoogleAdsAccount');
const CampaignModel = require('./Campaign');

// Initialize models
const User = UserModel(sequelize);
const GoogleAdsAccount = GoogleAdsAccountModel(sequelize);
const Campaign = CampaignModel(sequelize);

// Define associations
User.hasMany(GoogleAdsAccount, {
  foreignKey: 'userId',
  as: 'googleAdsAccounts'
});

GoogleAdsAccount.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

GoogleAdsAccount.hasMany(Campaign, {
  foreignKey: 'googleAdsAccountId',
  as: 'campaigns'
});

Campaign.belongsTo(GoogleAdsAccount, {
  foreignKey: 'googleAdsAccountId',
  as: 'googleAdsAccount'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  GoogleAdsAccount,
  Campaign
};