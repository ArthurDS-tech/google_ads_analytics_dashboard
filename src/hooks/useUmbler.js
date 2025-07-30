import { useState, useEffect, useCallback, useRef } from 'react';
import umblerService from '../services/umblerService';

export const useUmbler = () => {
  // Estados principais
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalMessages: 0,
    totalConversations: 0,
    openConversations: 0
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [webhookStatus, setWebhookStatus] = useState('unknown');
  const [systemHealth, setSystemHealth] = useState(null);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState({
    status: 'todos',
    tag: 'todas',
    search: ''
  });

  // Refs para polling
  const pollingRef = useRef(null);
  const healthCheckRef = useRef(null);

  // =============================================
  // FUNÇÕES DE CARREGAMENTO INICIAL
  // =============================================

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, contactsData, healthData] = await Promise.all([
        umblerService.getDashboardStats(),
        umblerService.getContactsWithLastMessage(),
        umblerService.checkHealth().catch(() => ({ status: 'error', connected: false }))
      ]);

      setStats(statsData);
      setContacts(contactsData);
      setSystemHealth(healthData);
      setWebhookStatus(healthData.connected ? 'connected' : 'disconnected');

    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================================
  // FUNÇÕES DE ATUALIZAÇÃO
  // =============================================

  const refreshData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const [statsData, contactsData] = await Promise.all([
        umblerService.getDashboardStats(),
        umblerService.getContactsWithLastMessage()
      ]);

      setStats(statsData);
      setContacts(contactsData);

    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setError(err.message || 'Erro ao atualizar dados');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const checkSystemHealth = useCallback(async () => {
    try {
      const healthData = await umblerService.checkHealth();
      setSystemHealth(healthData);
      setWebhookStatus(healthData.connected ? 'connected' : 'disconnected');
    } catch (err) {
      setSystemHealth({ status: 'error', connected: false });
      setWebhookStatus('error');
    }
  }, []);

  // =============================================
  // FUNÇÕES DE CHAT E MENSAGENS
  // =============================================

  const selectContact = useCallback(async (contact) => {
    try {
      setSelectedContact(contact);
      setConversationMessages([]);

      if (contact.conversation_id) {
        const messages = await umblerService.getConversationMessages(contact.conversation_id);
        setConversationMessages(messages);
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Erro ao carregar mensagens do contato');
    }
  }, []);

  const sendMessage = useCallback(async (contactId, messageContent) => {
    if (!messageContent.trim()) return;

    try {
      setSendingMessage(true);

      const messageData = {
        contact_id: contactId,
        content: messageContent.trim(),
        direction: 'outbound',
        message_type: 'text'
      };

      const sentMessage = await umblerService.sendMessage(messageData);

      // Atualizar mensagens da conversa
      if (selectedContact && selectedContact.id === contactId) {
        setConversationMessages(prev => [...prev, sentMessage.message]);
      }

      // Atualizar lista de contatos
      await refreshData();

      return sentMessage;

    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem');
      throw err;
    } finally {
      setSendingMessage(false);
    }
  }, [selectedContact, refreshData]);

  // =============================================
  // FUNÇÕES DE FILTROS
  // =============================================

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getFilteredContacts = useCallback(() => {
    return contacts.filter(contact => {
      // Filtro por status
      if (filters.status !== 'todos') {
        const statusMatch = contact.status === filters.status || 
          (filters.status === 'online' && contact.status === 'active') ||
          (filters.status === 'aguardando' && contact.status === 'pending') ||
          (filters.status === 'encerrado' && contact.status === 'inactive');
        
        if (!statusMatch) return false;
      }

      // Filtro por tag
      if (filters.tag !== 'todas' && contact.tags) {
        const hasTag = contact.tags.includes(filters.tag);
        if (!hasTag) return false;
      }

      // Filtro por busca
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const nameMatch = contact.name?.toLowerCase().includes(searchTerm);
        const phoneMatch = contact.phone?.toLowerCase().includes(searchTerm);
        
        if (!nameMatch && !phoneMatch) return false;
      }

      return true;
    });
  }, [contacts, filters]);

  // =============================================
  // FUNÇÕES DE GERENCIAMENTO DE CONTATOS
  // =============================================

  const createContact = useCallback(async (contactData) => {
    try {
      const newContact = await umblerService.createContact(contactData);
      setContacts(prev => [newContact.contact, ...prev]);
      await refreshData(); // Atualizar stats
      return newContact;
    } catch (err) {
      console.error('Erro ao criar contato:', err);
      setError('Erro ao criar contato');
      throw err;
    }
  }, [refreshData]);

  const updateContact = useCallback(async (contactId, contactData) => {
    try {
      const updatedContact = await umblerService.updateContact(contactId, contactData);
      
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId ? updatedContact.contact : contact
        )
      );

      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact(updatedContact.contact);
      }

      return updatedContact;
    } catch (err) {
      console.error('Erro ao atualizar contato:', err);
      setError('Erro ao atualizar contato');
      throw err;
    }
  }, [selectedContact]);

  const deleteContact = useCallback(async (contactId) => {
    try {
      await umblerService.deleteContact(contactId);
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact(null);
        setConversationMessages([]);
      }

      await refreshData(); // Atualizar stats
    } catch (err) {
      console.error('Erro ao deletar contato:', err);
      setError('Erro ao deletar contato');
      throw err;
    }
  }, [selectedContact, refreshData]);

  // =============================================
  // POLLING E TEMPO REAL
  // =============================================

  const startPolling = useCallback((interval = 10000) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    const stopPolling = umblerService.startPolling((data) => {
      if (data.error) {
        console.error('Erro no polling:', data.error);
        return;
      }

      setStats(data.stats);
      setContacts(data.contacts);
    }, interval);

    pollingRef.current = stopPolling;
    return stopPolling;
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      pollingRef.current();
      pollingRef.current = null;
    }
  }, []);

  const startHealthCheck = useCallback((interval = 30000) => {
    if (healthCheckRef.current) {
      clearInterval(healthCheckRef.current);
    }

    const intervalId = setInterval(checkSystemHealth, interval);
    healthCheckRef.current = intervalId;

    return () => clearInterval(intervalId);
  }, [checkSystemHealth]);

  // =============================================
  // EFEITOS
  // =============================================

  // Carregamento inicial
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Iniciar polling quando componente monta
  useEffect(() => {
    const stopPolling = startPolling();
    const stopHealthCheck = startHealthCheck();

    return () => {
      stopPolling();
      stopHealthCheck();
    };
  }, [startPolling, startHealthCheck]);

  // Limpar intervalos quando componente desmonta
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        pollingRef.current();
      }
      if (healthCheckRef.current) {
        clearInterval(healthCheckRef.current);
      }
    };
  }, []);

  // =============================================
  // FUNÇÕES UTILITÁRIAS
  // =============================================

  const getContactStatus = useCallback((contact) => {
    if (!contact) return 'inactive';
    
    // Mapear status do backend para status da UI
    const statusMap = {
      'active': 'online',
      'inactive': 'encerrado',
      'pending': 'aguardando',
      'blocked': 'encerrado'
    };

    return statusMap[contact.status] || 'encerrado';
  }, []);

  const getContactTags = useCallback((contact) => {
    if (!contact || !contact.tags) return [];
    return Array.isArray(contact.tags) ? contact.tags : [];
  }, []);

  const formatContactForUI = useCallback((contact) => {
    if (!contact) return null;

    return {
      id: contact.id,
      nome: contact.name || 'Sem nome',
      telefone: umblerService.formatPhoneNumber(contact.phone),
      etiqueta: getContactTags(contact)[0] || 'Sem tag',
      ultimoContato: umblerService.formatTimeAgo(contact.last_interaction),
      status: getContactStatus(contact),
      avatar: umblerService.generateAvatarInitials(contact.name),
      origem: 'WhatsApp',
      conversation_id: contact.conversation_id,
      raw: contact // Dados brutos para operações
    };
  }, [getContactStatus, getContactTags]);

  // =============================================
  // RETORNO DO HOOK
  // =============================================

  return {
    // Estados
    contacts: contacts.map(formatContactForUI),
    stats,
    selectedContact: selectedContact ? formatContactForUI(selectedContact) : null,
    conversationMessages,
    webhookStatus,
    systemHealth,
    loading,
    refreshing,
    error,
    sendingMessage,
    filters,

    // Dados filtrados
    filteredContacts: getFilteredContacts().map(formatContactForUI),

    // Ações
    refreshData,
    selectContact: (contact) => selectContact(contact.raw || contact),
    sendMessage,
    createContact,
    updateContact: (contactId, data) => updateContact(contactId, data),
    deleteContact,
    updateFilters,
    clearError: () => setError(null),

    // Polling
    startPolling,
    stopPolling,

    // Utilitários
    formatContactForUI,
    getContactStatus,
    getContactTags
  };
};