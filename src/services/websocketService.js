import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.eventListeners = new Map();
    
    // Configuration
    this.config = {
      url: this.getWebSocketUrl(),
      options: {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        autoConnect: false
      }
    };
  }

  getWebSocketUrl() {
    // Get WebSocket URL from environment or construct from current location
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 
                      process.env.REACT_APP_WEBSOCKET_URL ||
                      'http://localhost:3001';
    
    // Remove /api/umbler suffix if present
    const baseUrl = backendUrl.replace('/api/umbler', '');
    
    console.log('WebSocket URL:', baseUrl);
    return baseUrl;
  }

  connect(token = null) {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting to WebSocket server:', this.config.url);
        
        // Create socket connection
        this.socket = io(this.config.url, this.config.options);
        
        // Connection established
        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected successfully');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Authenticate if token provided
          if (token) {
            this.authenticate(token);
          }
          
          resolve(this.socket);
        });

        // Handle connection establishment confirmation
        this.socket.on('connection_established', (data) => {
          console.log('🎯 Connection established:', data);
          this.emit('connected', data);
        });

        // Handle authentication response
        this.socket.on('authenticated', (data) => {
          console.log('🔐 Authentication response:', data);
          this.emit('authenticated', data);
        });

        // Handle umbler data updates
        this.socket.on('umbler_data', (data) => {
          console.log('📊 Received umbler data:', data);
          this.emit('umbler_data', data);
        });

        // Handle real-time updates
        this.socket.on('umbler_update', (data) => {
          console.log('🔄 Received umbler update:', data);
          this.emit('umbler_update', data);
        });

        // Handle errors
        this.socket.on('error', (error) => {
          console.error('🚨 WebSocket error:', error);
          this.emit('error', error);
        });

        // Handle disconnection
        this.socket.on('disconnect', (reason) => {
          console.log('🔌 WebSocket disconnected:', reason);
          this.isConnected = false;
          this.emit('disconnected', { reason });
          
          // Attempt reconnection for certain disconnect reasons
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, don't reconnect automatically
            console.log('Server disconnected client, not attempting reconnect');
          } else {
            this.handleReconnection();
          }
        });

        // Handle reconnection attempts
        this.socket.on('reconnect_attempt', (attemptNumber) => {
          console.log(`🔄 Reconnection attempt ${attemptNumber}`);
          this.emit('reconnect_attempt', { attempt: attemptNumber });
        });

        // Handle successful reconnection
        this.socket.on('reconnect', (attemptNumber) => {
          console.log(`✅ Reconnected after ${attemptNumber} attempts`);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('reconnected', { attempts: attemptNumber });
        });

        // Handle reconnection failure
        this.socket.on('reconnect_failed', () => {
          console.error('❌ Failed to reconnect after maximum attempts');
          this.emit('reconnect_failed');
          reject(new Error('Failed to reconnect to WebSocket server'));
        });

        // Start connection
        this.socket.connect();
        
      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  authenticate(token) {
    if (this.socket && this.isConnected) {
      console.log('🔐 Authenticating with token:', token.substring(0, 8) + '...');
      this.socket.emit('authenticate', token);
    }
  }

  requestUmblerData() {
    if (this.socket && this.isConnected) {
      console.log('📊 Requesting umbler data');
      this.socket.emit('request_umbler_data');
    }
  }

  subscribeToUpdates() {
    if (this.socket && this.isConnected) {
      console.log('📡 Subscribing to real-time updates');
      this.socket.emit('subscribe_updates');
    }
  }

  unsubscribeFromUpdates() {
    if (this.socket && this.isConnected) {
      console.log('📡 Unsubscribing from real-time updates');
      this.socket.emit('unsubscribe_updates');
    }
  }

  // Event handling methods
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      
      console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      
      setTimeout(() => {
        if (!this.isConnected && this.socket) {
          this.socket.connect();
        }
      }, delay);
    } else {
      console.error('❌ Maximum reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached');
    }
  }

  // Utility methods
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null,
      transport: this.socket?.io?.engine?.transport?.name || null,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Fallback methods for compatibility
  setupWebSocket(url, token) {
    console.warn('setupWebSocket is deprecated, use connect() instead');
    return this.connect(token);
  }

  fallback() {
    console.warn('fallback method called - attempting to reconnect');
    if (!this.isConnected) {
      return this.connect();
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;