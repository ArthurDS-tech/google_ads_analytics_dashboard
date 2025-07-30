# 🔧 Guia Completo de Configuração de Ambiente

## 📋 Visão Geral

Este guia explica como configurar as variáveis de ambiente para o **frontend** e **backend** do Umbler Dashboard.

## 📁 Estrutura de Arquivos

```
projeto/
├── .env                    # ← Frontend (React + Vite)
├── .env.example           # ← Exemplo para frontend
├── backend/
│   ├── .env               # ← Backend (Node.js + Express)
│   └── .env.example       # ← Exemplo para backend
└── start-servers.sh       # ← Script para iniciar ambos
```

## 🌐 Configuração do Frontend

### Arquivo: `.env` (raiz do projeto)

```env
# URLs de conexão
REACT_APP_BACKEND_URL=http://localhost:3001/api/umbler
REACT_APP_WEBSOCKET_URL=http://localhost:3001
```

### Variáveis Disponíveis:
- `REACT_APP_BACKEND_URL` - URL da API do backend
- `REACT_APP_WEBSOCKET_URL` - URL do servidor WebSocket

> ⚠️ **Importante**: No Vite, todas as variáveis devem começar com `REACT_APP_`

## 🖥️ Configuração do Backend

### Arquivo: `backend/.env`

```env
# Configurações básicas do servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configurações de logs
LOG_LEVEL=info
ENABLE_DETAILED_LOGS=true

# Configurações de webhook
WEBHOOK_TIMEOUT=30000
WEBHOOK_MAX_RETRIES=3
```

### Configurações Opcionais (descomente quando necessário):

#### 🗄️ Banco de Dados (Supabase)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_key_aqui
```

#### 📊 Google Ads API
```env
GOOGLE_CLIENT_ID=seu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_google_client_secret_aqui
GOOGLE_DEVELOPER_TOKEN=seu_google_developer_token_aqui
GOOGLE_CLIENT_CUSTOMER_ID=seu_google_customer_id_aqui
```

#### 📱 Umbler API (WhatsApp)
```env
UMBLER_API_URL=https://api.umbler.com/v1
UMBLER_API_KEY=sua_api_key_do_umbler_aqui
UMBLER_WEBHOOK_SECRET=seu_webhook_secret_aqui
```

#### 🔐 Segurança
```env
JWT_SECRET=sua_jwt_secret_key_muito_segura_aqui
```

## 🚀 Configuração Rápida

### 1. Copiar arquivos de exemplo:

```bash
# Frontend
cp .env.example .env

# Backend
cp backend/.env.example backend/.env
```

### 2. Editar configurações conforme necessário

### 3. Iniciar servidores:

```bash
./start-servers.sh
```

## 🔍 Variáveis de Ambiente Detalhadas

### Frontend (React/Vite)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `REACT_APP_BACKEND_URL` | `http://localhost:3001/api/umbler` | URL da API REST |
| `REACT_APP_WEBSOCKET_URL` | `http://localhost:3001` | URL do WebSocket |

### Backend (Node.js/Express)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3001` | Porta do servidor |
| `NODE_ENV` | `development` | Ambiente de execução |
| `FRONTEND_URL` | `http://localhost:5173` | URL do frontend (CORS) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Janela de rate limiting (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Máximo de requests por janela |
| `LOG_LEVEL` | `info` | Nível de log |
| `ENABLE_DETAILED_LOGS` | `true` | Logs detalhados |
| `WEBHOOK_TIMEOUT` | `30000` | Timeout de webhook (30s) |
| `WEBHOOK_MAX_RETRIES` | `3` | Máximo de tentativas |

## 🌍 Ambientes Diferentes

### Desenvolvimento
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
REACT_APP_BACKEND_URL=http://localhost:3001/api/umbler
```

### Produção
```env
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
REACT_APP_BACKEND_URL=https://api.seu-dominio.com/api/umbler
```

### Staging
```env
NODE_ENV=staging
FRONTEND_URL=https://staging.seu-dominio.com
REACT_APP_BACKEND_URL=https://api-staging.seu-dominio.com/api/umbler
```

## 🧪 Validação da Configuração

### Verificar Frontend:
```bash
curl http://localhost:5173
```

### Verificar Backend:
```bash
curl http://localhost:3001/health
```

### Verificar API Umbler:
```bash
curl http://localhost:3001/api/umbler/stats
```

### Verificar WebSocket:
```bash
# No console do navegador deve aparecer:
# 🔧 Environment Configuration: { ... }
```

## ⚠️ Troubleshooting

### Erro "process is not defined"
✅ **Resolvido** - Use a configuração centralizada em `src/config/environment.js`

### Erro "Connection Refused"
- Verifique se o backend está rodando na porta correta
- Confirme as URLs no arquivo `.env`

### WebSocket não conecta
- Verifique `REACT_APP_WEBSOCKET_URL`
- Confirme que o backend suporta WebSocket (Socket.IO)

### CORS Error
- Verifique `FRONTEND_URL` no backend
- Confirme que as URLs estão corretas

## 📦 Exemplo Completo

### `.env` (Frontend)
```env
REACT_APP_BACKEND_URL=http://localhost:3001/api/umbler
REACT_APP_WEBSOCKET_URL=http://localhost:3001
```

### `backend/.env` (Backend)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
ENABLE_DETAILED_LOGS=true
WEBHOOK_TIMEOUT=30000
WEBHOOK_MAX_RETRIES=3
```

## 🎯 Status após Configuração

Após configurar corretamente, você deve ver:

- ✅ Frontend rodando em `http://localhost:5173`
- ✅ Backend rodando em `http://localhost:3001`
- ✅ WebSocket conectando sem erros
- ✅ API respondendo em `/health` e `/api/umbler/*`
- ✅ Console sem erros de "process is not defined"

**🎉 Sistema pronto para desenvolvimento!**