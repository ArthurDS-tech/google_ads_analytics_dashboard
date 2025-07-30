# WebSocket Integration for Umbler Dashboard

## Overview

This document explains the WebSocket integration that has been implemented to provide real-time communication between the frontend and backend for the Umbler WhatsApp Dashboard.

## What Was Fixed

### 1. WebSocket Configuration Issues
- **Problem**: Invalid URL construction (`localhost:undefined`)
- **Solution**: Proper environment variable handling and URL construction in `websocketService.js`

### 2. Backend API Connection Issues
- **Problem**: ERR_CONNECTION_REFUSED errors for API endpoints
- **Solution**: Fixed CORS configuration and ensured proper server initialization

### 3. Missing Dependencies
- **Problem**: WebSocket libraries not installed
- **Solution**: Added `socket.io` for backend and `socket.io-client` for frontend

### 4. Real-time Communication
- **Problem**: No real-time updates for Umbler data
- **Solution**: Complete WebSocket implementation with broadcasting

## Architecture

```
Frontend (React) <---> WebSocket Client Service <---> Socket.IO Server <---> Umbler Service
```

### Backend Components

1. **Socket.IO Server** (`backend/server.js`)
   - Handles WebSocket connections
   - Manages client authentication
   - Broadcasts updates to subscribed clients

2. **Umbler Service** (`backend/services/umblerService.js`)
   - Processes webhook data
   - Broadcasts updates via WebSocket
   - Provides API endpoints

### Frontend Components

1. **WebSocket Service** (`src/services/websocketService.js`)
   - Manages WebSocket connection
   - Handles reconnection logic
   - Provides event-based API

2. **useWebSocket Hook** (`src/hooks/useWebSocket.js`)
   - React hook for easy WebSocket integration
   - Manages connection state
   - Provides real-time data updates

## Usage

### Starting the Development Environment

```bash
# Start both frontend and backend
./start-servers.sh

# Stop both servers
./stop-servers.sh
```

### Using WebSocket in React Components

```javascript
import { useWebSocket } from '../hooks/useWebSocket';

function MyComponent() {
  const {
    isConnected,
    connectionStatus,
    umblerData,
    requestData,
    error
  } = useWebSocket({
    autoConnect: true,
    subscribeToUpdates: true,
    onMessage: (data) => {
      console.log('Received update:', data);
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  useEffect(() => {
    if (isConnected) {
      requestData(); // Request initial data
    }
  }, [isConnected, requestData]);

  return (
    <div>
      <p>Status: {connectionStatus}</p>
      {umblerData && (
        <div>
          <p>Contacts: {umblerData.stats?.totalContacts || 0}</p>
          <p>Messages: {umblerData.stats?.totalMessages || 0}</p>
        </div>
      )}
    </div>
  );
}
```

### Direct WebSocket Service Usage

```javascript
import websocketService from '../services/websocketService';

// Connect
await websocketService.connect('optional-token');

// Subscribe to events
websocketService.on('umbler_data', (data) => {
  console.log('Received data:', data);
});

// Request data
websocketService.requestUmblerData();

// Subscribe to real-time updates
websocketService.subscribeToUpdates();

// Disconnect
websocketService.disconnect();
```

## WebSocket Events

### Client to Server
- `authenticate` - Authenticate with token
- `request_umbler_data` - Request current umbler data
- `subscribe_updates` - Subscribe to real-time updates
- `unsubscribe_updates` - Unsubscribe from updates

### Server to Client
- `connection_established` - Connection confirmation
- `authenticated` - Authentication result
- `umbler_data` - Current umbler data response
- `umbler_update` - Real-time data updates
- `error` - Error notifications

## Environment Configuration

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:3001/api/umbler
REACT_APP_WEBSOCKET_URL=http://localhost:3001
```

### Backend (backend/.env)
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Testing WebSocket Connection

1. **Start the servers**:
   ```bash
   ./start-servers.sh
   ```

2. **Check backend health**:
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test API endpoints**:
   ```bash
   curl http://localhost:3001/api/umbler/stats
   curl http://localhost:3001/api/umbler/contacts?limit=1
   ```

4. **Open frontend**:
   ```
   http://localhost:5173
   ```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend server is running on port 3001
   - Check firewall settings
   - Verify environment variables

2. **WebSocket Connection Failed**
   - Check CORS configuration
   - Verify WebSocket URL is correct
   - Ensure Socket.IO versions are compatible

3. **No Real-time Updates**
   - Check if client is subscribed to updates
   - Verify webhook processing in backend
   - Check broadcast function integration

### Debug Commands

```bash
# View server logs
tail -f backend.log frontend.log

# Check running processes
ps aux | grep node
ps aux | grep vite

# Test API directly
curl -v http://localhost:3001/health
curl -v http://localhost:3001/api/umbler/stats
```

## Security Considerations

1. **Authentication**: Implement proper token validation
2. **Rate Limiting**: Already implemented for API endpoints
3. **CORS**: Configured for development environment
4. **Input Validation**: Validate all webhook data

## Performance

- WebSocket connections are optimized for low latency
- Automatic reconnection with exponential backoff
- Connection pooling and resource management
- Efficient event broadcasting to subscribed clients

## Next Steps

1. Implement authentication tokens
2. Add message queuing for reliability
3. Implement user-specific channels
4. Add monitoring and analytics
5. Production deployment configuration