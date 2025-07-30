import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import ENV_CONFIG from '../config/environment';

const WebSocketTest = () => {
  const [logs, setLogs] = useState([]);
  
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
      addLog(`📨 Received data: ${JSON.stringify(data, null, 2)}`);
    },
    onError: (error) => {
      addLog(`❌ Error: ${error.message || error}`);
    },
    onConnect: (data) => {
      addLog(`✅ Connected: ${JSON.stringify(data)}`);
    },
    onDisconnect: (data) => {
      addLog(`🔌 Disconnected: ${data.reason}`);
    }
  });

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog(`🔧 Environment loaded - Backend: ${ENV_CONFIG.BACKEND_URL}`);
    addLog(`🔧 WebSocket URL: ${ENV_CONFIG.WEBSOCKET_URL}`);
  }, []);

  useEffect(() => {
    if (isConnected) {
      addLog('🎯 WebSocket connected successfully!');
      requestData();
    }
  }, [isConnected, requestData]);

  const testApiConnection = async () => {
    try {
      addLog('🧪 Testing API connection...');
      const response = await fetch(`${ENV_CONFIG.BACKEND_URL.replace('/api/umbler', '')}/health`);
      const data = await response.json();
      addLog(`✅ API Response: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`❌ API Error: ${error.message}`);
    }
  };

  const testUmblerStats = async () => {
    try {
      addLog('📊 Testing Umbler stats...');
      const response = await fetch(`${ENV_CONFIG.BACKEND_URL}/stats`);
      const data = await response.json();
      addLog(`📈 Umbler Stats: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`❌ Stats Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">WebSocket Connection Test</h1>
      
      {/* Status */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus}
            </span>
          </div>
          <div>
            <span className="font-medium">Backend URL:</span>
            <span className="ml-2 text-sm text-gray-600">{ENV_CONFIG.BACKEND_URL}</span>
          </div>
          <div>
            <span className="font-medium">WebSocket URL:</span>
            <span className="ml-2 text-sm text-gray-600">{ENV_CONFIG.WEBSOCKET_URL}</span>
          </div>
          <div>
            <span className="font-medium">Environment:</span>
            <span className="ml-2 text-sm text-gray-600">
              {ENV_CONFIG.IS_DEVELOPMENT ? 'Development' : 'Production'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={requestData}
          disabled={!isConnected}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Request Data
        </button>
        <button
          onClick={testApiConnection}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test API
        </button>
        <button
          onClick={testUmblerStats}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Test Umbler Stats
        </button>
      </div>

      {/* Data Display */}
      {umblerData && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Latest Umbler Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Contacts:</span>
              <span className="ml-1">{umblerData.stats?.totalContacts || 0}</span>
            </div>
            <div>
              <span className="font-medium">Messages:</span>
              <span className="ml-1">{umblerData.stats?.totalMessages || 0}</span>
            </div>
            <div>
              <span className="font-medium">Conversations:</span>
              <span className="ml-1">{umblerData.stats?.totalConversations || 0}</span>
            </div>
            <div>
              <span className="font-medium">Open:</span>
              <span className="ml-1">{umblerData.stats?.openConversations || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error.message || JSON.stringify(error)}</p>
        </div>
      )}

      {/* Logs */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-white">Connection Logs</h2>
        <div className="font-mono text-sm space-y-1 max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;