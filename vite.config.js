import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'pages': path.resolve(__dirname, './src/pages'),
      'services': path.resolve(__dirname, './src/services'),
      'utils': path.resolve(__dirname, './src/utils'),
      'styles': path.resolve(__dirname, './src/styles'),
    },
  },
  define: {
    // Definir variáveis de ambiente globalmente
    'process.env.REACT_APP_BACKEND_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api/umbler'),
    'process.env.REACT_APP_WEBSOCKET_URL': JSON.stringify(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3001'),
  },
  server: {
    port: 5173,
    host: true,
  },
})