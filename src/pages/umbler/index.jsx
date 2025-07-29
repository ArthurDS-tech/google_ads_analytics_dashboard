import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Umbler = () => {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedTag, setSelectedTag] = useState('todas');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedClientChat, setSelectedClientChat] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const atendimentoStats = [
    {
      label: 'Total de Atendimentos',
      value: '247',
      icon: 'MessageSquare',
      color: 'primary',
      change: '+12',
      changeType: 'positive'
    },
    {
      label: 'Atendimentos Abertos',
      value: '23',
      icon: 'Clock',
      color: 'warning',
      change: '+5',
      changeType: 'positive'
    },
    {
      label: 'Atendimentos Encerrados',
      value: '224',
      icon: 'CheckCircle',
      color: 'success',
      change: '+18',
      changeType: 'positive'
    },
    {
      label: 'Tempo Médio Resposta',
      value: '12min',
      icon: 'Timer',
      color: 'accent',
      change: '-3min',
      changeType: 'positive'
    }
  ];

  const availableTags = [
    'Pesquisa 2 DVA', 'SUPORTE', 'thiago', 'Maju', 'BMW VEICULOS', 'BMW MOTOS', 
    'BMW MINI COOPER', 'REPECON FIAT', 'AUTOMEGA', 'LOJISTA', 'DICAS', 'PIX VISTORIA',
    'CLIENTE BALCAO', 'PV', 'Troca', 'Zero', 'zero fora', 'seminovo', 'Site AF PH',
    'Realizado', 'Não realizado', 'Qualificação', 'Pendente', 'Orçamento Enviado',
    'PGTO', 'Grupos', 'AVISO', 'Particular SJ', 'ZERO TUDO', 'ZERO ESCOLHA',
    'TROCA ESCOLHA', 'TROCA TUDO', 'Ana', 'Aguardando Verificação', 'Blumenau',
    'RECALL', 'Resolvendo com COO', 'BLUMENAU', 'Negociando', 'Parceiro'
  ];

  const clientes = [
    {
      id: 1,
      nome: 'João Silva',
      telefone: '+55 11 99999-8888',
      etiqueta: 'BMW VEICULOS',
      ultimoContato: '2 min atrás',
      status: 'online',
      avatar: 'JS',
      origem: 'WhatsApp',
      mensagens: [
        { id: 1, texto: 'Oi, gostaria de saber sobre o BMW X3', horario: '14:30', tipo: 'recebida' },
        { id: 2, texto: 'Olá! Temos o BMW X3 disponível. Gostaria de agendar um test drive?', horario: '14:32', tipo: 'enviada' },
        { id: 3, texto: 'Sim, quero agendar para amanhã de manhã', horario: '14:35', tipo: 'recebida' }
      ]
    },
    {
      id: 2,
      nome: 'Maria Santos',
      telefone: '+55 11 88888-7777',
      etiqueta: 'SUPORTE',
      ultimoContato: '15 min atrás',
      status: 'aguardando',
      avatar: 'MS',
      origem: 'WhatsApp',
      mensagens: [
        { id: 1, texto: 'Preciso de ajuda com meu BMW', horario: '13:45', tipo: 'recebida' },
        { id: 2, texto: 'Qual o problema específico que está enfrentando?', horario: '13:47', tipo: 'enviada' },
        { id: 3, texto: 'O ar condicionado não está funcionando', horario: '13:50', tipo: 'recebida' }
      ]
    },
    {
      id: 3,
      nome: 'Pedro Oliveira',
      telefone: '+55 11 77777-6666',
      etiqueta: 'Qualificação',
      ultimoContato: '1 hora atrás',
      status: 'encerrado',
      avatar: 'PO',
      origem: 'WhatsApp',
      mensagens: [
        { id: 1, texto: 'Quanto custa uma revisão completa?', horario: '12:30', tipo: 'recebida' },
        { id: 2, texto: 'Depende do modelo. Qual BMW você tem?', horario: '12:32', tipo: 'enviada' },
        { id: 3, texto: 'BMW 320i 2019', horario: '12:35', tipo: 'recebida' },
        { id: 4, texto: 'Para esse modelo fica R$ 890. Posso agendar?', horario: '12:40', tipo: 'enviada' },
        { id: 5, texto: 'Obrigado, vou pensar e retorno', horario: '12:45', tipo: 'recebida' }
      ]
    },
    {
      id: 4,
      nome: 'Ana Costa',
      telefone: '+55 11 66666-5555',
      etiqueta: 'BMW MOTOS',
      ultimoContato: '2 horas atrás',
      status: 'online',
      avatar: 'AC',
      origem: 'WhatsApp',
      mensagens: [
        { id: 1, texto: 'Vocês têm BMW F 850 GS?', horario: '11:20', tipo: 'recebida' },
        { id: 2, texto: 'Sim! Temos disponível. Quer mais informações?', horario: '11:22', tipo: 'enviada' },
        { id: 3, texto: 'Sim, qual o preço?', horario: '11:25', tipo: 'recebida' }
      ]
    },
    {
      id: 5,
      nome: 'Carlos Ferreira',
      telefone: '+55 11 55555-4444',
      etiqueta: 'Orçamento Enviado',
      ultimoContato: '3 horas atrás',
      status: 'aguardando',
      avatar: 'CF',
      origem: 'WhatsApp',
      mensagens: [
        { id: 1, texto: 'Recebi o orçamento por email', horario: '10:15', tipo: 'recebida' },
        { id: 2, texto: 'Perfeito! Alguma dúvida sobre os valores?', horario: '10:17', tipo: 'enviada' },
        { id: 3, texto: 'Posso parcelar em quantas vezes?', horario: '10:20', tipo: 'recebida' },
        { id: 4, texto: 'Até 24x sem juros para esse serviço', horario: '10:25', tipo: 'enviada' }
      ]
    },
    {
      id: 6,
      nome: 'Thiago Mendes',
      telefone: '+55 11 44444-3333',
      etiqueta: 'thiago',
      ultimoContato: '4 horas atrás',
      status: 'online',
      avatar: 'TM',
      origem: 'WhatsApp',
      mensagens: [
        { id: 1, texto: 'Preciso agendar revisão', horario: '09:30', tipo: 'recebida' },
        { id: 2, texto: 'Qual seria a melhor data para você?', horario: '09:32', tipo: 'enviada' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success text-success-foreground';
      case 'aguardando':
        return 'bg-warning text-warning-foreground';
      case 'encerrado':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'aguardando':
        return 'Aguardando';
      case 'encerrado':
        return 'Encerrado';
      default:
        return 'Novo';
    }
  };

  const getEtiquetaColor = (etiqueta) => {
    const colorMap = {
      'BMW VEICULOS': 'bg-blue-100 text-blue-800 border-blue-200',
      'BMW MOTOS': 'bg-red-100 text-red-800 border-red-200',
      'BMW MINI COOPER': 'bg-green-100 text-green-800 border-green-200',
      'SUPORTE': 'bg-purple-100 text-purple-800 border-purple-200',
      'Qualificação': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Orçamento Enviado': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'thiago': 'bg-pink-100 text-pink-800 border-pink-200',
      'Maju': 'bg-teal-100 text-teal-800 border-teal-200',
      'Ana': 'bg-orange-100 text-orange-800 border-orange-200',
      'Pendente': 'bg-amber-100 text-amber-800 border-amber-200',
      'Realizado': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Não realizado': 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return colorMap[etiqueta] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredClientes = clientes.filter(cliente => {
    const statusMatch = selectedFilter === 'todos' || 
      (selectedFilter === 'online' && cliente.status === 'online') ||
      (selectedFilter === 'aguardando' && cliente.status === 'aguardando') ||
      (selectedFilter === 'encerrado' && cliente.status === 'encerrado');
    
    const tagMatch = selectedTag === 'todas' || cliente.etiqueta === selectedTag;
    
    return statusMatch && tagMatch;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleChatClick = (cliente) => {
    setSelectedClientChat(cliente);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setSelectedClientChat(null);
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
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <Icon name={isRefreshing ? "Loader2" : "RefreshCw"} size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
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
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success' : 'text-error'}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs. semana anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                    <Icon name={stat.icon} size={24} className={`text-${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtros e Lista de Clientes */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
              <h2 className="text-xl font-semibold text-foreground">Clientes do WhatsApp</h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
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
                      onClick={() => setSelectedFilter(filter.key)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        selectedFilter === filter.key
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
                    <span>{selectedTag === 'todas' ? 'Todas as Tags' : selectedTag}</span>
                    <Icon name="ChevronDown" size={16} />
                  </Button>

                  {/* Dropdown de Tags */}
                  {showTagFilter && (
                    <div className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSelectedTag('todas');
                            setShowTagFilter(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            selectedTag === 'todas'
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
                              setSelectedTag(tag);
                              setShowTagFilter(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              selectedTag === tag
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
              {filteredClientes.map((cliente) => (
                <div key={cliente.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {cliente.avatar}
                      </div>
                      
                      {/* Info do Cliente */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-medium text-foreground">{cliente.nome}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getEtiquetaColor(cliente.etiqueta)}`}>
                            {cliente.etiqueta}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(cliente.status)}`}>
                            {getStatusText(cliente.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Icon name="Phone" size={14} />
                            <span>{cliente.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="MessageSquare" size={14} />
                            <span>{cliente.origem}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={14} />
                            <span>{cliente.ultimoContato}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleChatClick(cliente)}
                      >
                        <Icon name="MessageCircle" size={16} className="mr-1" />
                        Chat
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Eye" size={16} className="mr-1" />
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="MoreHorizontal" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Webhook" size={24} className="text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Webhook Status</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Integração ativa com WhatsApp
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-success text-success-foreground">
                  <Icon name="CheckCircle" size={12} className="mr-1" />
                  Conectado
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
          {showChatModal && selectedClientChat && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[1200] bg-black bg-opacity-50"
                onClick={handleCloseChatModal}
              ></div>
              
              {/* Modal */}
              <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
                  {/* Header do Chat */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {selectedClientChat.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{selectedClientChat.nome}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getEtiquetaColor(selectedClientChat.etiqueta)}`}>
                            {selectedClientChat.etiqueta}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedClientChat.status)}`}>
                            {getStatusText(selectedClientChat.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleCloseChatModal}>
                      <Icon name="X" size={20} />
                    </Button>
                  </div>
                  
                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedClientChat.mensagens.map((mensagem) => (
                      <div
                        key={mensagem.id}
                        className={`flex ${mensagem.tipo === 'enviada' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            mensagem.tipo === 'enviada'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{mensagem.texto}</p>
                          <p className={`text-xs mt-1 ${
                            mensagem.tipo === 'enviada' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {mensagem.horario}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer do Chat */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button size="sm">
                        <Icon name="Send" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                      <span>Telefone: {selectedClientChat.telefone}</span>
                      <span>Último contato: {selectedClientChat.ultimoContato}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Umbler;