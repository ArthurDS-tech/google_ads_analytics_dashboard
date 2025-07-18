const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRegistration = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || !validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!firstName || firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }

  if (!lastName || lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

const validateGoogleAdsAccount = (req, res, next) => {
  const { 
    customerId, 
    accountName, 
    accessToken, 
    refreshToken, 
    tokenExpiry,
    developerToken,
    clientId,
    clientSecret
  } = req.body;
  
  const errors = [];

  if (!customerId || customerId.trim().length === 0) {
    errors.push('Customer ID is required');
  }

  if (!accountName || accountName.trim().length === 0) {
    errors.push('Account name is required');
  }

  if (!accessToken || accessToken.trim().length === 0) {
    errors.push('Access token is required');
  }

  if (!refreshToken || refreshToken.trim().length === 0) {
    errors.push('Refresh token is required');
  }

  if (!tokenExpiry || !Date.parse(tokenExpiry)) {
    errors.push('Valid token expiry date is required');
  }

  if (!developerToken || developerToken.trim().length === 0) {
    errors.push('Developer token is required');
  }

  if (!clientId || clientId.trim().length === 0) {
    errors.push('Client ID is required');
  }

  if (!clientSecret || clientSecret.trim().length === 0) {
    errors.push('Client secret is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate && !Date.parse(startDate)) {
    return res.status(400).json({ 
      error: 'Invalid start date format' 
    });
  }

  if (endDate && !Date.parse(endDate)) {
    return res.status(400).json({ 
      error: 'Invalid end date format' 
    });
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ 
      error: 'Start date cannot be after end date' 
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateGoogleAdsAccount,
  validateDateRange,
  validateEmail,
  validatePassword
};