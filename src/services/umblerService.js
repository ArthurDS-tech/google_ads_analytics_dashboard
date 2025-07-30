// Serviço para integração com o backend Umbler
import axios from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api/umbler';

class UmblerService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Erro na API Umbler:', error);
        throw this.handleError(error);
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Erro da API
      return {
        message: error.response.data?.error || 'Erro na requisição',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Erro de rede
      return {
        message: 'Erro de conexão com o servidor',
        status: 0
      };
    } else {
      // Erro desconhecido
      return {
        message: error.message || 'Erro desconhecido',
        status: -1
      };
    }
  }

  // =============================================
  // MÉTODOS DE CONTATOS
  // =============================================

  async getContacts(params = {}) {
    try {
      const response = await this.api.get('/contacts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getContact(id) {
    try {
      const response = await this.api.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createContact(contactData) {
    try {
      const response = await this.api.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateContact(id, contactData) {
    try {
      const response = await this.api.put(`/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteContact(id) {
    try {
      const response = await this.api.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // =============================================
  // MÉTODOS DE MENSAGENS
  // =============================================

  async getMessages(params = {}) {
    try {
      const response = await this.api.get('/messages', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getMessage(id) {
    try {
      const response = await this.api.get(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(messageData) {
    try {
      const response = await this.api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateMessage(id, messageData) {
    try {
      const response = await this.api.put(`/messages/${id}`, messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      const response = await this.api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // =============================================
  // MÉTODOS DE CONVERSAS
  // =============================================

  async getConversations(params = {}) {
    try {
      const response = await this.api.get('/conversations', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getConversation(id) {
    try {
      const response = await this.api.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createConversation(conversationData) {
    try {
      const response = await this.api.post('/conversations', conversationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateConversation(id, conversationData) {
    try {
      const response = await this.api.put(`/conversations/${id}`, conversationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteConversation(id) {
    try {
      const response = await this.api.delete(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // =============================================
  // MÉTODOS DE SISTEMA
  // =============================================

  async getSystemStatus() {
    try {
      const response = await this.api.get('/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getWebhookInfo() {
    try {
      const response = await this.api.get('/webhook/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRecentLogs() {
    try {
      const response = await this.api.get('/logs/recent');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await this.api.get('/health/detailed', { 
        timeout: 5000 
      });
      return { ...response.data, connected: true };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }

  async getDetailedHealth() {
    try {
      const response = await this.api.get('/health/detailed', { 
        timeout: 5000 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // =============================================
  // MÉTODOS ESPECIAIS PARA DASHBOARD
  // =============================================

  async getDashboardStats() {
    try {
      const response = await this.api.get('/stats');
      return response.data;
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

  async getContactsWithLastMessage() {
    try {
      const contactsResponse = await this.getContacts({ 
        include_last_message: true,
        sort: 'last_interaction',
        order: 'desc'
      });

      return contactsResponse.contacts || [];
    } catch (error) {
      console.error('Erro ao buscar contatos com última mensagem:', error);
      return [];
    }
  }

  async getConversationMessages(conversationId, params = {}) {
    try {
      const response = await this.getMessages({
        conversation_id: conversationId,
        sort: 'created_at',
        order: 'asc',
        ...params
      });

      return response.messages || [];
    } catch (error) {
      console.error('Erro ao buscar mensagens da conversa:', error);
      return [];
    }
  }

  // =============================================
  // MÉTODOS DE POLLING PARA TEMPO REAL
  // =============================================

  startPolling(callback, interval = 5000) {
    const pollData = async () => {
      try {
        const [stats, contacts] = await Promise.all([
          this.getDashboardStats(),
          this.getContactsWithLastMessage()
        ]);

        callback({
          stats,
          contacts,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Erro no polling:', error);
        callback({ error: error.message });
      }
    };

    // Primeira execução imediata
    pollData();

    // Configurar intervalo
    const intervalId = setInterval(pollData, interval);

    // Retornar função para parar o polling
    return () => clearInterval(intervalId);
  }

  // =============================================
  // MÉTODOS DE UTILITÁRIOS
  // =============================================

  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formatar número brasileiro
    if (cleaned.length === 13 && cleaned.startsWith('55')) {
      const ddd = cleaned.substring(2, 4);
      const number = cleaned.substring(4);
      const firstPart = number.substring(0, 5);
      const secondPart = number.substring(5);
      return `+55 ${ddd} ${firstPart}-${secondPart}`;
    }
    
    return phone;
  }

  getStatusColor(status) {
    const statusMap = {
      'active': 'bg-success text-success-foreground',
      'inactive': 'bg-muted text-muted-foreground',
      'blocked': 'bg-destructive text-destructive-foreground',
      'open': 'bg-primary text-primary-foreground',
      'closed': 'bg-muted text-muted-foreground',
      'pending': 'bg-warning text-warning-foreground',
      'resolved': 'bg-success text-success-foreground'
    };

    return statusMap[status] || 'bg-muted text-muted-foreground';
  }

  getStatusText(status) {
    const statusMap = {
      'active': 'Ativo',
      'inactive': 'Inativo',
      'blocked': 'Bloqueado',
      'open': 'Aberto',
      'closed': 'Fechado',
      'pending': 'Pendente',
      'resolved': 'Resolvido'
    };

    return statusMap[status] || status;
  }

  formatTimeAgo(timestamp) {
    if (!timestamp) return 'Nunca';

    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return time.toLocaleDateString('pt-BR');
  }

  generateAvatarInitials(name) {
    if (!name) return '??';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
}

// Instância singleton
const umblerService = new UmblerService();

export default umblerService;