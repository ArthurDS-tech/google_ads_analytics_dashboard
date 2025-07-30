import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocketService';

export const useWebSocket = (options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [umblerData, setUmblerData] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const {
    autoConnect = true,
    token = null,
    subscribeToUpdates = true,
    onMessage = null,
    onError = null,
    onConnect = null,
    onDisconnect = null
  } = options;

  // Event handlers
  const handleConnected = useCallback((data) => {
    console.log('WebSocket connected:', data);
    setIsConnected(true);
    setConnectionStatus('connected');
    setError(null);
    isConnectingRef.current = false;
    
    if (subscribeToUpdates) {
      websocketService.subscribeToUpdates();
    }
    
    if (onConnect) {
      onConnect(data);
    }
  }, [subscribeToUpdates, onConnect]);

  const handleDisconnected = useCallback((data) => {
    console.log('WebSocket disconnected:', data);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    isConnectingRef.current = false;
    
    if (onDisconnect) {
      onDisconnect(data);
    }
  }, [onDisconnect]);

  const handleError = useCallback((error) => {
    console.error('WebSocket error:', error);
    setError(error);
    setConnectionStatus('error');
    isConnectingRef.current = false;
    
    if (onError) {
      onError(error);
    }
  }, [onError]);

  const handleUmblerData = useCallback((data) => {
    console.log('Received umbler data:', data);
    setUmblerData(data);
    setData(data);
    
    if (onMessage) {
      onMessage(data);
    }
  }, [onMessage]);

  const handleUmblerUpdate = useCallback((update) => {
    console.log('Received umbler update:', update);
    setData(update);
    
    if (onMessage) {
      onMessage(update);
    }
  }, [onMessage]);

  const handleReconnectAttempt = useCallback((data) => {
    console.log('Reconnection attempt:', data);
    setConnectionStatus('reconnecting');
  }, []);

  const handleReconnected = useCallback((data) => {
    console.log('Reconnected:', data);
    setIsConnected(true);
    setConnectionStatus('connected');
    setError(null);
    
    // Re-subscribe to updates after reconnection
    if (subscribeToUpdates) {
      websocketService.subscribeToUpdates();
    }
  }, [subscribeToUpdates]);

  // Connection management
  const connect = useCallback(async () => {
    if (isConnectingRef.current || isConnected) {
      return;
    }

    try {
      isConnectingRef.current = true;
      setConnectionStatus('connecting');
      setError(null);
      
      await websocketService.connect(token);
    } catch (error) {
      console.error('Failed to connect:', error);
      setError(error);
      setConnectionStatus('error');
      isConnectingRef.current = false;
    }
  }, [token, isConnected]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const requestData = useCallback(() => {
    if (isConnected) {
      websocketService.requestUmblerData();
    }
  }, [isConnected]);

  const sendMessage = useCallback((message) => {
    if (isConnected && websocketService.socket) {
      websocketService.socket.emit('message', message);
    }
  }, [isConnected]);

  // Setup event listeners
  useEffect(() => {
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);
    websocketService.on('umbler_data', handleUmblerData);
    websocketService.on('umbler_update', handleUmblerUpdate);
    websocketService.on('reconnect_attempt', handleReconnectAttempt);
    websocketService.on('reconnected', handleReconnected);

    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('umbler_data', handleUmblerData);
      websocketService.off('umbler_update', handleUmblerUpdate);
      websocketService.off('reconnect_attempt', handleReconnectAttempt);
      websocketService.off('reconnected', handleReconnected);
    };
  }, [
    handleConnected,
    handleDisconnected,
    handleError,
    handleUmblerData,
    handleUmblerUpdate,
    handleReconnectAttempt,
    handleReconnected
  ]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnectingRef.current) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [autoConnect, connect, isConnected]);

  return {
    isConnected,
    connectionStatus,
    error,
    data,
    umblerData,
    connect,
    disconnect,
    requestData,
    sendMessage,
    websocketService // Expose service for advanced usage
  };
};