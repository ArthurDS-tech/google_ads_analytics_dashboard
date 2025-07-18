const { sequelize, User, GoogleAdsAccount } = require('../models');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('Database models synchronized successfully.');

    // Create default admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          dateFormat: 'dd/MM/yyyy',
          currency: 'BRL'
        }
      });
      console.log(`Admin user created with email: ${adminEmail}`);
    } else {
      console.log('Admin user already exists.');
    }

    // Create demo user if not exists
    const demoEmail = process.env.DEMO_EMAIL || 'demo@example.com';
    const demoPassword = process.env.DEMO_PASSWORD || 'demo123';

    const existingDemo = await User.findOne({ where: { email: demoEmail } });
    
    if (!existingDemo) {
      await User.create({
        email: demoEmail,
        password: demoPassword,
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          dateFormat: 'dd/MM/yyyy',
          currency: 'BRL'
        }
      });
      console.log(`Demo user created with email: ${demoEmail}`);
    } else {
      console.log('Demo user already exists.');
    }

    console.log('Database initialization completed successfully!');
    
    console.log('\n=== Database Setup Complete ===');
    console.log('You can now start the server with: npm run server');
    console.log('Or run both frontend and backend with: npm run dev');
    console.log('\nDefault Users:');
    console.log(`Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`Demo: ${demoEmail} / ${demoPassword}`);
    console.log('=================================\n');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run initialization
initializeDatabase();