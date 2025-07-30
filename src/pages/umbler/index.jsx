import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useUmbler } from '../../hooks/useUmbler';
import ChatModal from '../../components/umbler/ChatModal';
import ContactCard from '../../components/umbler/ContactCard';
import StatsCard from '../../components/umbler/StatsCard';

const Umbler = () => {
  // Estados locais da UI
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Hook personalizado para gerenciar dados do Umbler
  const {
    // Estados
    contacts,
    stats,
    selectedContact,
    conversationMessages,
    webhookStatus,
    systemHealth,
    loading,
    refreshing,
    error,
    sendingMessage,
    filters,
    filteredContacts,

    // Ações
    refreshData,
    selectContact,
    sendMessage,
    updateFilters,
    clearError
  } = useUmbler();

  // Estatísticas dinâmicas baseadas nos dados reais
  const atendimentoStats = [
    {
      label: 'Total de Contatos',
      value: stats.totalContacts,
      icon: 'Users',
      color: 'primary',
      loading: loading
    },
    {
      label: 'Conversas Abertas',
      value: stats.openConversations,
      icon: 'MessageCircle',
      color: 'warning',
      loading: loading
    },
    {
      label: 'Total de Mensagens',
      value: stats.totalMessages,
      icon: 'MessageSquare',
      color: 'success',
      loading: loading
    },
    {
      label: 'Status do Webhook',
      value: webhookStatus === 'connected' ? 'Conectado' : 
             webhookStatus === 'error' ? 'Erro' : 'Desconectado',
      icon: 'Webhook',
      color: webhookStatus === 'connected' ? 'success' : 
             webhookStatus === 'error' ? 'error' : 'warning',
      loading: loading
    }
  ];

  // Tags disponíveis extraídas dos contatos reais
  const availableTags = React.useMemo(() => {
    const tags = new Set();
    contacts.forEach(contact => {
      if (contact.etiqueta && contact.etiqueta !== 'Sem tag') {
        tags.add(contact.etiqueta);
      }
    });
    return Array.from(tags).sort();
  }, [contacts]);

  // Contatos filtrados com busca local
  const contactsWithSearch = React.useMemo(() => {
    if (!searchTerm.trim()) return filteredContacts;
    
    const searchLower = searchTerm.toLowerCase();
    return filteredContacts.filter(contact => 
      contact.nome.toLowerCase().includes(searchLower) ||
      contact.telefone.toLowerCase().includes(searchLower) ||
      contact.etiqueta.toLowerCase().includes(searchLower)
    );
  }, [filteredContacts, searchTerm]);

  // Handlers para ações da interface
  const handleChatClick = async (contact) => {
    await selectContact(contact);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
  };

  const handleSendMessage = async (contactId, messageContent) => {
    try {
      await sendMessage(contactId, messageContent);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleViewContact = (contact) => {
    console.log('Ver detalhes do contato:', contact);
    // Implementar modal de detalhes do contato
  };

  const handleMoreActions = (contact) => {
    console.log('Mais ações para contato:', contact);
    // Implementar menu de ações
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTagFilter && !event.target.closest('.tag-filter-dropdown')) {
        setShowTagFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTagFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Centro de Atendimento</h1>
              <p className="text-muted-foreground">
                Gerencie atendimentos e clientes do WhatsApp integrado via webhook
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshData}
                disabled={refreshing}
              >
                <Icon name={refreshing ? "Loader2" : "RefreshCw"} size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Exportar
              </Button>
              
              <Button size="sm">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Novo Atendimento
              </Button>
            </div>
          </div>

          {/* Atendimento Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {atendimentoStats.map((stat, index) => (
              <StatsCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                loading={stat.loading}
              />
            ))}
          </div>

          {/* Filtros e Lista de Clientes */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-foreground">Contatos do WhatsApp</h2>
                {loading && (
                  <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                )}
                {error && (
                  <div className="flex items-center space-x-2 text-destructive">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm">{error}</span>
                    <Button variant="ghost" size="sm" onClick={clearError}>
                      <Icon name="X" size={12} />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Campo de busca */}
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar contatos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                  />
                </div>

                {/* Filtros de Status */}
                <div className="flex bg-muted rounded-lg p-1">
                  {[
                    { key: 'todos', label: 'Todos' },
                    { key: 'online', label: 'Online' },
                    { key: 'aguardando', label: 'Aguardando' },
                    { key: 'encerrado', label: 'Encerrado' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => updateFilters({ status: filter.key })}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        filters.status === filter.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Botão de Filtro por Tags */}
                <div className="relative tag-filter-dropdown">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTagFilter(!showTagFilter)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Tag" size={16} />
                    <span>{filters.tag === 'todas' ? 'Todas as Tags' : filters.tag}</span>
                    <Icon name="ChevronDown" size={16} />
                  </Button>

                  {/* Dropdown de Tags */}
                  {showTagFilter && (
                    <div className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            updateFilters({ tag: 'todas' });
                            setShowTagFilter(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            filters.tag === 'todas'
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          Todas as Tags
                        </button>
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              updateFilters({ tag });
                              setShowTagFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              filters.tag === tag
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {loading && contactsWithSearch.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Carregando contatos...</p>
                </div>
              ) : contactsWithSearch.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon name="Users" size={48} className="text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum contato encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Tente ajustar sua busca ou filtros.' : 'Aguarde mensagens via webhook para ver os contatos aqui.'}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                      <Icon name="X" size={16} className="mr-2" />
                      Limpar busca
                    </Button>
                  )}
                </div>
              ) : (
                contactsWithSearch.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onChatClick={handleChatClick}
                    onViewClick={handleViewContact}
                    onMoreClick={handleMoreActions}
                    showLastMessage={true}
                  />
                ))
              )}
            </div>
          </div>

          {/* Gráfico de Atendimentos */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Gráfico de Atendimentos</h2>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Gráfico de Atendimentos por Período</p>
                <p className="text-xs text-muted-foreground mt-1">Dados em tempo real do webhook do WhatsApp</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                  webhookStatus === 'connected' ? 'bg-success/10' :
                  webhookStatus === 'error' ? 'bg-destructive/10' : 'bg-warning/10'
                }`}>
                  <Icon name="Webhook" size={24} className={
                    webhookStatus === 'connected' ? 'text-success' :
                    webhookStatus === 'error' ? 'text-destructive' : 'text-warning'
                  } />
                </div>
                <h3 className="font-medium text-foreground mb-2">Status do Webhook</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {webhookStatus === 'connected' ? 'Integração ativa com WhatsApp' :
                   webhookStatus === 'error' ? 'Erro na conexão' : 'Verificando conexão...'}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  webhookStatus === 'connected' ? 'bg-success text-success-foreground' :
                  webhookStatus === 'error' ? 'bg-destructive text-destructive-foreground' :
                  'bg-warning text-warning-foreground'
                }`}>
                  <Icon name={
                    webhookStatus === 'connected' ? 'CheckCircle' :
                    webhookStatus === 'error' ? 'XCircle' : 'Clock'
                  } size={12} className="mr-1" />
                  {webhookStatus === 'connected' ? 'Conectado' :
                   webhookStatus === 'error' ? 'Erro' : 'Conectando...'}
                </span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="MessageSquare" size={24} className="text-success" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Últimas Mensagens</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Sincronização em tempo real
                </p>
                <Button variant="outline" size="sm">Ver Todas</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Settings" size={24} className="text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Gerenciar webhook e notificações
                </p>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </div>
          </div>

          {/* Modal de Chat */}
          <ChatModal
            isOpen={showChatModal}
            onClose={handleCloseChatModal}
            contact={selectedContact}
            messages={conversationMessages}
            onSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
            webhookStatus={webhookStatus}
          />
        </div>
      </main>
    </div>
  );
};

export default Umbler;