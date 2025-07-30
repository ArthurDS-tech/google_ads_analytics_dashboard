# 🚀 Integração Umbler - Frontend

Este documento descreve como configurar e usar a integração com o backend Umbler para gerenciamento de contatos e mensagens do WhatsApp via webhook.

## 📋 Visão Geral

A página Umbler (`/umbler`) é uma interface completa para:

- **Visualizar contatos** recebidos via webhook do WhatsApp
- **Gerenciar conversas** em tempo real
- **Enviar mensagens** diretamente pelo painel
- **Monitorar status** do webhook e conexões
- **Filtrar e buscar** contatos e mensagens

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# URL do seu backend Umbler
REACT_APP_BACKEND_URL=http://localhost:3000/api

# Configurações opcionais
REACT_APP_POLLING_INTERVAL=10000
REACT_APP_HEALTH_CHECK_INTERVAL=30000
REACT_APP_API_TIMEOUT=10000
REACT_APP_DEBUG=false
```

### 2. Backend Requerido

Certifique-se de que o backend Umbler está rodando e acessível na URL configurada. O backend deve fornecer os seguintes endpoints:

#### Endpoints Obrigatórios:
- `GET /api/contacts` - Listar contatos
- `GET /api/messages` - Listar mensagens
- `GET /api/conversations` - Listar conversas
- `POST /api/messages` - Enviar mensagem
- `GET /api/status` - Status do sistema
- `GET /health` - Health check

## 🎯 Funcionalidades

### 1. Dashboard de Estatísticas

- **Total de Contatos**: Número total de contatos cadastrados
- **Conversas Abertas**: Conversas ativas no momento
- **Total de Mensagens**: Todas as mensagens processadas
- **Status do Webhook**: Indicador em tempo real da conexão

### 2. Lista de Contatos

#### Recursos:
- **Busca em tempo real** por nome, telefone ou tag
- **Filtros por status**: Todos, Online, Aguardando, Encerrado
- **Filtros por tags**: Baseado nas tags dos contatos
- **Atualização automática** via polling (10s por padrão)

#### Informações Exibidas:
- Nome e avatar do contato
- Telefone formatado
- Tags/etiquetas
- Status da conversa
- Último contato
- Última mensagem (quando disponível)

### 3. Chat em Tempo Real

#### Recursos:
- **Interface de chat** similar ao WhatsApp
- **Envio de mensagens** em tempo real
- **Histórico completo** da conversa
- **Indicadores de status** (enviado, entregue, lido)
- **Auto-scroll** para novas mensagens
- **Contador de caracteres** (limite 4096)

#### Atalhos:
- `Enter` - Enviar mensagem
- `Shift + Enter` - Nova linha
- `ESC` - Fechar chat

### 4. Monitoramento

#### Status do Webhook:
- 🟢 **Conectado**: Webhook funcionando normalmente
- 🟡 **Conectando**: Verificando conexão
- 🔴 **Erro**: Problema na conexão

#### Atualizações Automáticas:
- **Polling de dados**: A cada 10 segundos
- **Health check**: A cada 30 segundos
- **Indicadores visuais** de carregamento

## 🛠️ Arquitetura

### Componentes Principais:

```
src/pages/umbler/
├── index.jsx                 # Página principal
├── components/
│   ├── ChatModal.jsx        # Modal de chat
│   ├── ContactCard.jsx      # Card de contato
│   └── StatsCard.jsx        # Card de estatísticas
├── hooks/
│   └── useUmbler.js         # Hook de gerenciamento de estado
└── services/
    └── umblerService.js     # Serviço de API
```

### Fluxo de Dados:

1. **useUmbler Hook** gerencia todo o estado da aplicação
2. **umblerService** faz as chamadas para a API
3. **Polling automático** mantém os dados atualizados
4. **Componentes reutilizáveis** para interface consistente

## 📡 Integração com Backend

### Estrutura de Dados Esperada:

#### Contato:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "phone": "5511999999999",
  "email": "joao@email.com",
  "tags": ["cliente", "vip"],
  "status": "active",
  "last_interaction": "2024-01-01T00:00:00Z",
  "conversation_id": "uuid"
}
```

#### Mensagem:
```json
{
  "id": "uuid",
  "conversation_id": "uuid",
  "contact_id": "uuid",
  "content": "Olá, como posso ajudar?",
  "direction": "inbound",
  "message_type": "text",
  "status": "delivered",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Mapeamento de Status:

#### Status do Contato:
- `active` → Online (🟢)
- `pending` → Aguardando (🟡)
- `inactive` → Encerrado (⚫)

#### Status da Mensagem:
- `sent` → Enviado (✓)
- `delivered` → Entregue (✓✓)
- `read` → Lido (✓✓ azul)
- `failed` → Falha (⚠️)

## 🔍 Troubleshooting

### Problemas Comuns:

#### 1. Contatos não aparecem
- ✅ Verifique se o backend está rodando
- ✅ Confirme a URL no `.env`
- ✅ Verifique os logs do navegador (F12)
- ✅ Teste o endpoint `/api/contacts` diretamente

#### 2. Webhook desconectado
- ✅ Verifique o status do backend
- ✅ Confirme a configuração do webhook na Umbler
- ✅ Teste o endpoint `/health`

#### 3. Mensagens não enviam
- ✅ Verifique se o contato tem `conversation_id`
- ✅ Confirme o endpoint `/api/messages`
- ✅ Verifique logs de erro no console

#### 4. Polling não funciona
- ✅ Verifique se há erros de CORS
- ✅ Confirme o intervalo no `.env`
- ✅ Teste a conectividade com o backend

### Debug Mode:

Ative o debug no `.env`:
```env
REACT_APP_DEBUG=true
```

Isso habilitará logs detalhados no console do navegador.

## 🚀 Deploy

### Desenvolvimento:
```bash
npm run dev
```

### Produção:
```bash
npm run build
npm run preview
```

### Variáveis de Produção:
```env
REACT_APP_BACKEND_URL=https://seu-backend.com/api
REACT_APP_POLLING_INTERVAL=15000
REACT_APP_HEALTH_CHECK_INTERVAL=60000
```

## 📊 Métricas e Performance

### Otimizações Implementadas:

- **Memoização** com `React.useMemo` para listas filtradas
- **Debounce** na busca para evitar muitas requisições
- **Polling inteligente** que para em caso de erro
- **Lazy loading** de mensagens por conversa
- **Componentização** para reutilização e performance

### Monitoramento:

- **Health checks** automáticos
- **Logs estruturados** para debug
- **Indicadores visuais** de status
- **Tratamento de erros** robusto

## 🔐 Segurança

### Medidas Implementadas:

- **Sanitização** de inputs de mensagem
- **Validação** de dados da API
- **Timeout** em requisições
- **Tratamento** de erros de rede
- **Escape** de caracteres especiais

## 📝 Contribuição

Para contribuir com melhorias:

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Implemente os testes necessários
4. Faça commit das mudanças
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico:

- Verifique os logs do navegador (F12 → Console)
- Teste os endpoints da API diretamente
- Consulte a documentação do backend
- Verifique as configurações do webhook na Umbler

---

**🎉 Integração completa e funcional!** 

A página Umbler está pronta para gerenciar todos os contatos e mensagens recebidas via webhook do WhatsApp de forma eficiente e em tempo real.