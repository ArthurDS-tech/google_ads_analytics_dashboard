const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const logger = require('../utils/logger');

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const user = await User.create({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        preferences: userData.preferences || {}
      });

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      logger.info(`New user registered: ${user.email}`);

      return {
        user: userResponse,
        ...tokens
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Find user
      const user = await User.findOne({
        where: { email, isActive: true }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const tokens = this.generateTokens(user.id);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      logger.info(`User logged in: ${user.email}`);

      return {
        user: userResponse,
        ...tokens
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
      );

      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user.id);

      return {
        user,
        ...tokens
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update user
      await user.update(updateData);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      logger.info(`Profile updated for user: ${user.email}`);

      return userResponse;
    } catch (error) {
      logger.error('Profile update error:', error);
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await user.update({ password: newPassword });

      logger.info(`Password changed for user: ${user.email}`);

      return { message: 'Password updated successfully' };
    } catch (error) {
      logger.error('Password change error:', error);
      throw error;
    }
  }

  async logout(userId) {
    try {
      logger.info(`User logged out: ${userId}`);
      // In a real app, you might want to blacklist the token
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();