import express from 'express';
import { DatabaseService } from '../services/databaseService.js';
import { UmblerService } from '../services/umblerService.js';

const router = express.Router();
const dbService = new DatabaseService();
const umblerService = new UmblerService();

// =============================================
// WEBHOOK ENDPOINTS
// =============================================

// Receber webhooks do Umbler
router.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Webhook recebido:', req.body);
    
    const webhookData = req.body;
    
    // Processar diferentes tipos de webhook
    switch (webhookData.type) {
      case 'message':
        await umblerService.processIncomingMessage(webhookData);
        break;
      case 'contact':
        await umblerService.processContactUpdate(webhookData);
        break;
      case 'conversation':
        await umblerService.processConversationUpdate(webhookData);
        break;
      default:
        console.log('Tipo de webhook não reconhecido:', webhookData.type);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processado com sucesso',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ 
      error: 'Erro ao processar webhook',
      message: error.message 
    });
  }
});

// Verificar status do webhook
router.get('/webhook/status', async (req, res) => {
  try {
    const status = await umblerService.getWebhookStatus();
    res.json(status);
  } catch (error) {
    console.error('Erro ao verificar status do webhook:', error);
    res.status(500).json({ error: 'Erro ao verificar status do webhook' });
  }
});

// =============================================
// CONTACT ENDPOINTS
// =============================================

// Listar contatos
router.get('/contacts', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      status,
      tag,
      include_last_message = false,
      sort = 'last_interaction',
      order = 'desc'
    } = req.query;

    const contacts = await umblerService.getContacts({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
      tag,
      includeLastMessage: include_last_message === 'true',
      sort,
      order
    });

    res.json({
      contacts: contacts.data,
      total: contacts.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(contacts.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro ao buscar contatos' });
  }
});

// Buscar contato específico
router.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await umblerService.getContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    res.json({ contact });
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ error: 'Erro ao buscar contato' });
  }
});

// Criar novo contato
router.post('/contacts', async (req, res) => {
  try {
    const contact = await umblerService.createContact(req.body);
    res.status(201).json({ 
      contact,
      message: 'Contato criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ error: 'Erro ao criar contato' });
  }
});

// Atualizar contato
router.put('/contacts/:id', async (req, res) => {
  try {
    const contact = await umblerService.updateContact(req.params.id, req.body);
    res.json({ 
      contact,
      message: 'Contato atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(500).json({ error: 'Erro ao atualizar contato' });
  }
});

// Deletar contato
router.delete('/contacts/:id', async (req, res) => {
  try {
    await umblerService.deleteContact(req.params.id);
    res.json({ message: 'Contato deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    res.status(500).json({ error: 'Erro ao deletar contato' });
  }
});

// =============================================
// MESSAGE ENDPOINTS
// =============================================

// Listar mensagens
router.get('/messages', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      conversation_id,
      contact_id,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    const messages = await umblerService.getMessages({
      page: parseInt(page),
      limit: parseInt(limit),
      conversationId: conversation_id,
      contactId: contact_id,
      sort,
      order
    });

    res.json({
      messages: messages.data,
      total: messages.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(messages.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// Buscar mensagem específica
router.get('/messages/:id', async (req, res) => {
  try {
    const message = await umblerService.getMessage(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    res.json({ message });
  } catch (error) {
    console.error('Erro ao buscar mensagem:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagem' });
  }
});

// Enviar mensagem
router.post('/messages', async (req, res) => {
  try {
    const message = await umblerService.sendMessage(req.body);
    res.status(201).json({ 
      message,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// =============================================
// CONVERSATION ENDPOINTS
// =============================================

// Listar conversas
router.get('/conversations', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      sort = 'updated_at',
      order = 'desc'
    } = req.query;

    const conversations = await umblerService.getConversations({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      sort,
      order
    });

    res.json({
      conversations: conversations.data,
      total: conversations.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(conversations.total / parseInt(limit))
    });
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ error: 'Erro ao buscar conversas' });
  }
});

// Buscar conversa específica
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await umblerService.getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }
    res.json({ conversation });
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    res.status(500).json({ error: 'Erro ao buscar conversa' });
  }
});

// =============================================
// DASHBOARD & STATS ENDPOINTS
// =============================================

// Estatísticas do dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = await umblerService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Status do sistema
router.get('/status', async (req, res) => {
  try {
    const status = await umblerService.getSystemStatus();
    res.json(status);
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error);
    res.status(500).json({ error: 'Erro ao verificar status do sistema' });
  }
});

// Health check detalhado
router.get('/health/detailed', async (req, res) => {
  try {
    const health = await umblerService.getDetailedHealth();
    res.json(health);
  } catch (error) {
    console.error('Erro ao verificar saúde do sistema:', error);
    res.status(500).json({ error: 'Erro ao verificar saúde do sistema' });
  }
});

// Logs recentes
router.get('/logs/recent', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const logs = await umblerService.getRecentLogs(parseInt(limit));
    res.json({ logs });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

export default router;