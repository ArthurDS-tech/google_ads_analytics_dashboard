import { supabase } from '../config/database.js';

export class UmblerService {
  constructor() {
    this.webhookLogs = [];
    this.systemStatus = {
      connected: false,
      lastWebhook: null,
      messageCount: 0,
      contactCount: 0,
      conversationCount: 0
    };
  }

  // =============================================
  // WEBHOOK PROCESSING
  // =============================================

  async processIncomingMessage(webhookData) {
    try {
      console.log('📨 Processando mensagem recebida:', webhookData);

      const messageData = {
        id: webhookData.id || this.generateId(),
        conversation_id: webhookData.conversation_id,
        contact_id: webhookData.contact_id || webhookData.from,
        content: webhookData.message || webhookData.text || webhookData.content,
        message_type: webhookData.message_type || 'text',
        direction: webhookData.direction || 'inbound',
        timestamp: webhookData.timestamp || new Date().toISOString(),
        status: 'received',
        metadata: {
          platform: 'whatsapp',
          webhook_id: webhookData.id,
          raw_data: webhookData
        }
      };

      // Salvar mensagem no banco
      if (supabase) {
        await this.saveMessage(messageData);
      }

      // Atualizar ou criar contato
      if (webhookData.contact || webhookData.from) {
        await this.processContactFromMessage(webhookData);
      }

      // Atualizar estatísticas
      this.systemStatus.messageCount++;
      this.systemStatus.lastWebhook = new Date().toISOString();
      this.systemStatus.connected = true;

      // Log do webhook
      this.addWebhookLog({
        type: 'message',
        status: 'processed',
        data: messageData,
        timestamp: new Date().toISOString()
      });

      return messageData;
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      this.addWebhookLog({
        type: 'message',
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async processContactUpdate(webhookData) {
    try {
      console.log('👤 Processando atualização de contato:', webhookData);

      const contactData = {
        id: webhookData.id || webhookData.contact_id,
        name: webhookData.name || webhookData.contact_name,
        phone: webhookData.phone || webhookData.contact_phone,
        email: webhookData.email,
        status: webhookData.status || 'active',
        tags: webhookData.tags || [],
        last_interaction: webhookData.last_interaction || new Date().toISOString(),
        metadata: {
          platform: 'whatsapp',
          webhook_id: webhookData.id,
          raw_data: webhookData
        }
      };

      // Salvar/atualizar contato no banco
      if (supabase) {
        await this.saveContact(contactData);
      }

      // Atualizar estatísticas
      this.systemStatus.lastWebhook = new Date().toISOString();
      this.systemStatus.connected = true;

      // Log do webhook
      this.addWebhookLog({
        type: 'contact',
        status: 'processed',
        data: contactData,
        timestamp: new Date().toISOString()
      });

      return contactData;
    } catch (error) {
      console.error('Erro ao processar contato:', error);
      this.addWebhookLog({
        type: 'contact',
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async processConversationUpdate(webhookData) {
    try {
      console.log('💬 Processando atualização de conversa:', webhookData);

      const conversationData = {
        id: webhookData.id || webhookData.conversation_id,
        contact_id: webhookData.contact_id,
        status: webhookData.status || 'open',
        last_message_at: webhookData.last_message_at || new Date().toISOString(),
        message_count: webhookData.message_count || 0,
        metadata: {
          platform: 'whatsapp',
          webhook_id: webhookData.id,
          raw_data: webhookData
        }
      };

      // Salvar/atualizar conversa no banco
      if (supabase) {
        await this.saveConversation(conversationData);
      }

      // Atualizar estatísticas
      this.systemStatus.lastWebhook = new Date().toISOString();
      this.systemStatus.connected = true;

      // Log do webhook
      this.addWebhookLog({
        type: 'conversation',
        status: 'processed',
        data: conversationData,
        timestamp: new Date().toISOString()
      });

      return conversationData;
    } catch (error) {
      console.error('Erro ao processar conversa:', error);
      this.addWebhookLog({
        type: 'conversation',
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async processContactFromMessage(webhookData) {
    try {
      const contactData = {
        id: webhookData.contact_id || webhookData.from,
        name: webhookData.contact_name || webhookData.from_name || 'Contato WhatsApp',
        phone: webhookData.contact_phone || webhookData.from,
        status: 'active',
        last_interaction: new Date().toISOString(),
        tags: ['whatsapp'],
        metadata: {
          platform: 'whatsapp',
          source: 'message_webhook'
        }
      };

      return await this.saveContact(contactData);
    } catch (error) {
      console.error('Erro ao processar contato da mensagem:', error);
      throw error;
    }
  }

  // =============================================
  // DATABASE OPERATIONS
  // =============================================

  async saveMessage(messageData) {
    if (!supabase) {
      console.warn('Database not configured, message not saved');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('umbler_messages')
        .upsert({
          id: messageData.id,
          conversation_id: messageData.conversation_id,
          contact_id: messageData.contact_id,
          content: messageData.content,
          message_type: messageData.message_type,
          direction: messageData.direction,
          timestamp: messageData.timestamp,
          status: messageData.status,
          metadata: messageData.metadata
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      throw error;
    }
  }

  async saveContact(contactData) {
    if (!supabase) {
      console.warn('Database not configured, contact not saved');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('umbler_contacts')
        .upsert({
          id: contactData.id,
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email,
          status: contactData.status,
          tags: contactData.tags,
          last_interaction: contactData.last_interaction,
          metadata: contactData.metadata,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      // Atualizar contador
      this.systemStatus.contactCount++;
      
      return data[0];
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      throw error;
    }
  }

  async saveConversation(conversationData) {
    if (!supabase) {
      console.warn('Database not configured, conversation not saved');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('umbler_conversations')
        .upsert({
          id: conversationData.id,
          contact_id: conversationData.contact_id,
          status: conversationData.status,
          last_message_at: conversationData.last_message_at,
          message_count: conversationData.message_count,
          metadata: conversationData.metadata,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      // Atualizar contador
      this.systemStatus.conversationCount++;
      
      return data[0];
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
      throw error;
    }
  }

  // =============================================
  // DATA RETRIEVAL METHODS
  // =============================================

  async getContacts(options = {}) {
    const {
      page = 1,
      limit = 50,
      search,
      status,
      tag,
      includeLastMessage = false,
      sort = 'last_interaction',
      order = 'desc'
    } = options;

    if (!supabase) {
      // Retornar dados mock se não há banco configurado
      return {
        data: this.getMockContacts(),
        total: 5
      };
    }

    try {
      let query = supabase
        .from('umbler_contacts')
        .select('*', { count: 'exact' });

      // Filtros
      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (tag) {
        query = query.contains('tags', [tag]);
      }

      // Ordenação
      query = query.order(sort, { ascending: order === 'asc' });

      // Paginação
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      // Incluir última mensagem se solicitado
      if (includeLastMessage && data) {
        for (let contact of data) {
          const lastMessage = await this.getContactLastMessage(contact.id);
          contact.last_message = lastMessage;
        }
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      return {
        data: this.getMockContacts(),
        total: 5
      };
    }
  }

  async getContact(id) {
    if (!supabase) {
      return this.getMockContacts().find(c => c.id === id);
    }

    try {
      const { data, error } = await supabase
        .from('umbler_contacts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar contato:', error);
      return null;
    }
  }

  async getMessages(options = {}) {
    const {
      page = 1,
      limit = 50,
      conversationId,
      contactId,
      sort = 'timestamp',
      order = 'desc'
    } = options;

    if (!supabase) {
      return {
        data: this.getMockMessages(),
        total: 3
      };
    }

    try {
      let query = supabase
        .from('umbler_messages')
        .select('*', { count: 'exact' });

      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      if (contactId) {
        query = query.eq('contact_id', contactId);
      }

      query = query.order(sort, { ascending: order === 'asc' });

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return {
        data: this.getMockMessages(),
        total: 3
      };
    }
  }

  async getMessage(id) {
    if (!supabase) {
      return this.getMockMessages().find(m => m.id === id);
    }

    try {
      const { data, error } = await supabase
        .from('umbler_messages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error);
      return null;
    }
  }

  async getConversations(options = {}) {
    const {
      page = 1,
      limit = 50,
      status,
      sort = 'last_message_at',
      order = 'desc'
    } = options;

    if (!supabase) {
      return {
        data: this.getMockConversations(),
        total: 3
      };
    }

    try {
      let query = supabase
        .from('umbler_conversations')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order(sort, { ascending: order === 'asc' });

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return {
        data: this.getMockConversations(),
        total: 3
      };
    }
  }

  async getConversation(id) {
    if (!supabase) {
      return this.getMockConversations().find(c => c.id === id);
    }

    try {
      const { data, error } = await supabase
        .from('umbler_conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar conversa:', error);
      return null;
    }
  }

  async getContactLastMessage(contactId) {
    if (!supabase) {
      return this.getMockMessages()[0];
    }

    try {
      const { data, error } = await supabase
        .from('umbler_messages')
        .select('*')
        .eq('contact_id', contactId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0] || null;
    } catch (error) {
      console.error('Erro ao buscar última mensagem:', error);
      return null;
    }
  }

  // =============================================
  // CRUD OPERATIONS
  // =============================================

  async createContact(contactData) {
    const contact = {
      id: this.generateId(),
      name: contactData.name,
      phone: contactData.phone,
      email: contactData.email,
      status: contactData.status || 'active',
      tags: contactData.tags || [],
      last_interaction: new Date().toISOString(),
      metadata: contactData.metadata || {}
    };

    return await this.saveContact(contact);
  }

  async updateContact(id, contactData) {
    const existingContact = await this.getContact(id);
    if (!existingContact) {
      throw new Error('Contato não encontrado');
    }

    const updatedContact = {
      ...existingContact,
      ...contactData,
      id: id, // Manter ID original
      updated_at: new Date().toISOString()
    };

    return await this.saveContact(updatedContact);
  }

  async deleteContact(id) {
    if (!supabase) {
      console.warn('Database not configured, contact not deleted');
      return true;
    }

    try {
      const { error } = await supabase
        .from('umbler_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      throw error;
    }
  }

  async sendMessage(messageData) {
    const message = {
      id: this.generateId(),
      conversation_id: messageData.conversation_id || this.generateId(),
      contact_id: messageData.contact_id,
      content: messageData.content,
      message_type: messageData.message_type || 'text',
      direction: 'outbound',
      timestamp: new Date().toISOString(),
      status: 'sent',
      metadata: {
        platform: 'whatsapp',
        sent_via: 'api'
      }
    };

    // Salvar mensagem
    const savedMessage = await this.saveMessage(message);

    // Aqui você integraria com a API do WhatsApp/Umbler para enviar a mensagem
    // Por enquanto, apenas simulamos o envio
    console.log('📤 Mensagem enviada:', message);

    return savedMessage;
  }

  // =============================================
  // DASHBOARD & STATS
  // =============================================

  async getDashboardStats() {
    if (!supabase) {
      return {
        totalContacts: this.systemStatus.contactCount || 5,
        totalMessages: this.systemStatus.messageCount || 15,
        totalConversations: this.systemStatus.conversationCount || 3,
        openConversations: Math.floor((this.systemStatus.conversationCount || 3) * 0.6)
      };
    }

    try {
      const [contacts, messages, conversations] = await Promise.all([
        supabase.from('umbler_contacts').select('id', { count: 'exact', head: true }),
        supabase.from('umbler_messages').select('id', { count: 'exact', head: true }),
        supabase.from('umbler_conversations').select('id', { count: 'exact', head: true })
      ]);

      const openConversations = await supabase
        .from('umbler_conversations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'open');

      return {
        totalContacts: contacts.count || 0,
        totalMessages: messages.count || 0,
        totalConversations: conversations.count || 0,
        openConversations: openConversations.count || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalContacts: 0,
        totalMessages: 0,
        totalConversations: 0,
        openConversations: 0
      };
    }
  }

  async getSystemStatus() {
    return {
      ...this.systemStatus,
      database: supabase ? 'connected' : 'not_configured',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  async getWebhookStatus() {
    const lastWebhookAge = this.systemStatus.lastWebhook 
      ? Date.now() - new Date(this.systemStatus.lastWebhook).getTime()
      : null;

    return {
      connected: this.systemStatus.connected && (lastWebhookAge ? lastWebhookAge < 300000 : false), // 5 minutos
      lastWebhook: this.systemStatus.lastWebhook,
      messageCount: this.systemStatus.messageCount,
      recentLogs: this.webhookLogs.slice(-10)
    };
  }

  async getDetailedHealth() {
    const stats = await this.getDashboardStats();
    const webhookStatus = await this.getWebhookStatus();
    
    return {
      status: 'healthy',
      database: {
        connected: !!supabase,
        type: 'supabase'
      },
      webhook: webhookStatus,
      stats,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  async getRecentLogs(limit = 100) {
    return this.webhookLogs.slice(-limit);
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  generateId() {
    return `umbler_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addWebhookLog(logData) {
    this.webhookLogs.push(logData);
    
    // Manter apenas os últimos 1000 logs
    if (this.webhookLogs.length > 1000) {
      this.webhookLogs = this.webhookLogs.slice(-1000);
    }
  }

  // =============================================
  // MOCK DATA FOR DEVELOPMENT
  // =============================================

  getMockContacts() {
    return [
      {
        id: 'contact_1',
        name: 'João Silva',
        phone: '+55 11 99999-9999',
        email: 'joao@email.com',
        status: 'active',
        tags: ['cliente', 'vip'],
        last_interaction: new Date(Date.now() - 3600000).toISOString(),
        metadata: { platform: 'whatsapp' }
      },
      {
        id: 'contact_2',
        name: 'Maria Santos',
        phone: '+55 11 88888-8888',
        email: 'maria@email.com',
        status: 'active',
        tags: ['prospect'],
        last_interaction: new Date(Date.now() - 7200000).toISOString(),
        metadata: { platform: 'whatsapp' }
      },
      {
        id: 'contact_3',
        name: 'Pedro Oliveira',
        phone: '+55 11 77777-7777',
        status: 'inactive',
        tags: ['cliente'],
        last_interaction: new Date(Date.now() - 86400000).toISOString(),
        metadata: { platform: 'whatsapp' }
      }
    ];
  }

  getMockMessages() {
    return [
      {
        id: 'msg_1',
        conversation_id: 'conv_1',
        contact_id: 'contact_1',
        content: 'Olá! Gostaria de saber mais sobre seus serviços.',
        message_type: 'text',
        direction: 'inbound',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'received'
      },
      {
        id: 'msg_2',
        conversation_id: 'conv_1',
        contact_id: 'contact_1',
        content: 'Claro! Ficarei feliz em ajudar. Que tipo de serviço você está procurando?',
        message_type: 'text',
        direction: 'outbound',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'sent'
      },
      {
        id: 'msg_3',
        conversation_id: 'conv_2',
        contact_id: 'contact_2',
        content: 'Boa tarde! Vocês têm disponibilidade para esta semana?',
        message_type: 'text',
        direction: 'inbound',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'received'
      }
    ];
  }

  getMockConversations() {
    return [
      {
        id: 'conv_1',
        contact_id: 'contact_1',
        status: 'open',
        last_message_at: new Date(Date.now() - 3500000).toISOString(),
        message_count: 2
      },
      {
        id: 'conv_2',
        contact_id: 'contact_2',
        status: 'open',
        last_message_at: new Date(Date.now() - 7200000).toISOString(),
        message_count: 1
      },
      {
        id: 'conv_3',
        contact_id: 'contact_3',
        status: 'closed',
        last_message_at: new Date(Date.now() - 86400000).toISOString(),
        message_count: 5
      }
    ];
  }
}