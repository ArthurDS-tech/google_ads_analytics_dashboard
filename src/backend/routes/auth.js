const express = require('express');
const { auth } = require('../middleware/auth');
const authService = require('../services/authService');
const { validateRegistration, validateLogin } = require('../utils/validators');

const router = express.Router();

// Register
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const result = await authService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', auth, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/profile', auth, async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'preferences'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await authService.updateProfile(req.user.id, updateData);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', auth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', auth, async (req, res, next) => {
  try {
    const result = await authService.logout(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;