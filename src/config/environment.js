// Configuração centralizada de ambiente para o frontend

// Função auxiliar para obter variáveis de ambiente de forma segura
function getEnvVar(key, defaultValue) {
  // Tenta import.meta.env primeiro (Vite)
  if (import.meta?.env?.[key]) {
    return import.meta.env[key];
  }
  
  // Fallback para process.env (se disponível - definido pelo Vite)
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  
  // Retorna valor padrão
  return defaultValue;
}

// Configurações de ambiente
export const ENV_CONFIG = {
  // URLs do backend
  BACKEND_URL: getEnvVar('REACT_APP_BACKEND_URL', 'http://localhost:3001/api/umbler'),
  WEBSOCKET_URL: getEnvVar('REACT_APP_WEBSOCKET_URL', 'http://localhost:3001'),
  
  // Configurações de desenvolvimento
  IS_DEVELOPMENT: getEnvVar('NODE_ENV', 'development') === 'development',
  
  // Configurações do WebSocket
  WEBSOCKET_CONFIG: {
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000,
    TIMEOUT: 10000,
  },
  
  // Configurações da API
  API_CONFIG: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  }
};

// Log das configurações em desenvolvimento
if (ENV_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    BACKEND_URL: ENV_CONFIG.BACKEND_URL,
    WEBSOCKET_URL: ENV_CONFIG.WEBSOCKET_URL,
    IS_DEVELOPMENT: ENV_CONFIG.IS_DEVELOPMENT
  });
}

export default ENV_CONFIG;