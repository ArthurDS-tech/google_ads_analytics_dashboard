# 🚀 Google Ads Analytics Dashboard com Integração Umbler

Um dashboard completo para análise de campanhas do Google Ads com integração ao Umbler (WhatsApp Business), permitindo gerenciar campanhas e atendimento em uma única plataforma.

## ✨ Funcionalidades

### 📊 Google Ads Dashboard
- ✅ Análise de campanhas em tempo real
- ✅ Métricas de performance (CTR, CPC, conversões)
- ✅ Gráficos interativos
- ✅ Relatórios personalizados
- ✅ Autenticação OAuth2 com Google

### 💬 Umbler Integration (WhatsApp Business)
- ✅ **Centro de Atendimento** completo
- ✅ **Gerenciamento de Contatos** do WhatsApp
- ✅ **Chat em tempo real** com clientes
- ✅ **Webhooks automáticos** para receber mensagens
- ✅ **Estatísticas de atendimento** em tempo real
- ✅ **Filtros e busca** avançada
- ✅ **Status de conexão** com monitoramento

## 🚀 Execução Rápida

```bash
# Clone o repositório
git clone [seu-repositorio]
cd google-ads-analytics-dashboard

# Execute o script de inicialização (Linux/Mac)
./start-dev.sh

# Ou execute manualmente:
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
npm install && npm run dev
```

## 🌐 Acesso ao Sistema

Após executar, você terá acesso a:

- **🌐 Dashboard Principal**: http://localhost:5173
- **💬 Umbler Dashboard**: http://localhost:5173/umbler
- **🖥️ Backend API**: http://localhost:3001
- **🔗 Webhook URL**: http://localhost:3001/api/umbler/webhook

## 🔧 Configuração do Webhook

### 1. Configure no Umbler
No painel do Umbler, configure o webhook para:
```
http://localhost:3001/api/umbler/webhook
```

### 2. Teste o Webhook
```bash
curl -X POST http://localhost:3001/api/umbler/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "id": "test_msg_1",
    "contact_id": "test_contact_1", 
    "content": "Mensagem de teste",
    "from": "5511999999999",
    "contact_name": "Teste Webhook"
  }'
```

## 📊 Funcionalidades do Dashboard Umbler

### Centro de Atendimento
- **Contatos**: Lista completa com última interação
- **Mensagens**: Histórico e chat em tempo real  
- **Conversas**: Gerenciamento de status
- **Estatísticas**: Métricas em tempo real
- **Filtros**: Por status, tags e busca
- **Webhook**: Status de conexão e logs

### Interface Responsiva
- ✅ Design moderno e intuitivo
- ✅ Atualização automática (polling)
- ✅ Notificações de status
- ✅ Filtros avançados
- ✅ Chat modal integrado

## 🗄️ Banco de Dados (Opcional)

O sistema funciona **sem banco de dados** usando dados mock, mas pode ser integrado ao Supabase:

1. Crie conta no [Supabase](https://supabase.com)
2. Execute `backend/database/umbler_schema.sql`
3. Configure `backend/.env`:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-key
```

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Umbler       │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (WhatsApp)    │
│   Port: 5173    │    │   Port: 3001    │    │   (Webhooks)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Supabase      │
                       │   (Database)    │
                       │   (Opcional)    │
                       └─────────────────┘
```

## 📡 API Endpoints

### Google Ads
- `GET /api/auth/url` - URL de autenticação
- `POST /api/auth/callback` - Callback OAuth
- `GET /api/accounts` - Contas do Google Ads
- `GET /api/campaigns/:id` - Campanhas
- `GET /api/reports/:id` - Relatórios

### Umbler
- `GET /api/umbler/contacts` - Listar contatos
- `GET /api/umbler/messages` - Listar mensagens
- `POST /api/umbler/messages` - Enviar mensagem
- `GET /api/umbler/stats` - Estatísticas
- `POST /api/umbler/webhook` - Webhook endpoint
- `GET /api/umbler/health/detailed` - Health check

## 🧪 Testes

### Teste do Backend
```bash
# Health check
curl http://localhost:3001/health

# Estatísticas Umbler
curl http://localhost:3001/api/umbler/stats

# Contatos
curl http://localhost:3001/api/umbler/contacts
```

### Teste do Webhook
```bash
# Simular mensagem recebida
curl -X POST http://localhost:3001/api/umbler/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"message","content":"Teste","from":"5511999999999"}'
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── pages/umbler/           # Dashboard Umbler
│   ├── components/umbler/      # Componentes do Umbler
│   ├── hooks/useUmbler.js      # Hook personalizado
│   └── services/umblerService.js # Serviço da API
├── backend/
│   ├── routes/umbler.js        # Rotas da API
│   ├── services/umblerService.js # Lógica de negócio
│   └── database/umbler_schema.sql # Schema do banco
├── start-dev.sh               # Script de inicialização
└── INTEGRAÇÃO_UMBLER.md       # Documentação detalhada
```

## 🔒 Configuração de Ambiente

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Google Ads (opcional)
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# Supabase (opcional)
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_KEY=sua_service_key
```

### Frontend (`.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:3001
```

## 🚀 Deploy para Produção

1. **Configure variáveis de produção**
2. **Build do frontend**: `npm run build`
3. **Inicie backend**: `cd backend && npm start`
4. **Configure webhook**: `https://seu-dominio.com/api/umbler/webhook`

## 📖 Documentação Completa

Para documentação detalhada, consulte:
- **[INTEGRAÇÃO_UMBLER.md](./INTEGRAÇÃO_UMBLER.md)** - Guia completo da integração
- **[IMPLEMENTACAO_COMPLETA.md](./IMPLEMENTACAO_COMPLETA.md)** - Detalhes técnicos
- **[UMBLER_INTEGRATION.md](./UMBLER_INTEGRATION.md)** - Especificações da API

## ✅ Status do Sistema

- ✅ **Backend completo** com todas as APIs
- ✅ **Frontend totalmente integrado**
- ✅ **Webhook funcionando** 
- ✅ **Dados mock** para desenvolvimento
- ✅ **Banco opcional** para persistência
- ✅ **Scripts automatizados**
- ✅ **Documentação completa**
- ✅ **Testado e funcional**

## 🎯 Como Usar

1. **Execute**: `./start-dev.sh`
2. **Acesse**: http://localhost:5173/umbler
3. **Configure webhook** no Umbler
4. **Teste** enviando mensagens
5. **Veja** atualizações em tempo real

---

**🚀 Sistema 100% funcional e pronto para uso!**

Para dúvidas ou suporte, consulte a documentação completa em [INTEGRAÇÃO_UMBLER.md](./INTEGRAÇÃO_UMBLER.md).
