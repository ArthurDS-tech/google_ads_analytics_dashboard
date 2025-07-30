import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Configure environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import accountRoutes from './routes/accounts.js';
import reportsRoutes from './routes/reports.js';
import umblerRoutes from './routes/umbler.js';

// Import services
import { UmblerService } from './services/umblerService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize Umbler service
const umblerService = new UmblerService();

app.get('/', (req, res) => {
  res.send('🚀 Backend Google Ads API rodando! Veja em /api ou /health');
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('CORS Configuration:', corsOptions);
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    websocket: {
      connected: io.engine.clientsCount > 0,
      clients: io.engine.clientsCount
    }
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Google Ads Dashboard API',
    version: '1.0.0',
    status: 'active',
    endpoints: [
      'GET /api/auth/url',
      'POST /api/auth/callback',
      'GET /api/accounts',
      'GET /api/campaigns/:id',
      'GET /api/reports/:id',
      'GET /api/umbler/*'
    ]
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/umbler', umblerRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 WebSocket client connected: ${socket.id}`);
  
  // Send initial status
  socket.emit('connection_established', {
    clientId: socket.id,
    timestamp: new Date().toISOString(),
    message: 'WebSocket connection established successfully'
  });

  // Handle client authentication
  socket.on('authenticate', (token) => {
    console.log(`🔐 Client ${socket.id} authenticating with token: ${token}`);
    // Here you would validate the token
    socket.emit('authenticated', { success: true, clientId: socket.id });
  });

  // Handle umbler data requests
  socket.on('request_umbler_data', async () => {
    try {
      const stats = await umblerService.getDashboardStats();
      const contacts = await umblerService.getContacts({ limit: 10 });
      const recentMessages = await umblerService.getMessages({ limit: 5 });
      
      socket.emit('umbler_data', {
        stats,
        contacts: contacts.data,
        recentMessages: recentMessages.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching umbler data:', error);
      socket.emit('error', { message: 'Failed to fetch umbler data', error: error.message });
    }
  });

  // Handle real-time updates subscription
  socket.on('subscribe_updates', () => {
    console.log(`📡 Client ${socket.id} subscribed to real-time updates`);
    socket.join('umbler_updates');
  });

  socket.on('unsubscribe_updates', () => {
    console.log(`📡 Client ${socket.id} unsubscribed from real-time updates`);
    socket.leave('umbler_updates');
  });

  socket.on('disconnect', (reason) => {
    console.log(`🔌 WebSocket client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// Function to broadcast umbler updates to all subscribed clients
export function broadcastUmblerUpdate(data) {
  io.to('umbler_updates').emit('umbler_update', {
    ...data,
    timestamp: new Date().toISOString()
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Google Ads Dashboard API is ready`);
  console.log(`🔌 WebSocket server initialized`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  
  // Connect Umbler service to WebSocket broadcasting
  umblerService.setWebSocketBroadcast(broadcastUmblerUpdate);
});

export { io };