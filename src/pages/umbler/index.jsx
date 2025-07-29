import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Umbler = () => {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const clientes = [
    {
      id: 1,
      nome: 'João Silva',
      telefone: '+55 11 99999-8888',
      etiqueta: 'VIP',
      ultimoContato: '2 min atrás',
      status: 'online',
      avatar: 'JS',
      origem: 'WhatsApp'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      telefone: '+55 11 88888-7777',
      etiqueta: 'Suporte',
      ultimoContato: '15 min atrás',
      status: 'aguardando',
      avatar: 'MS',
      origem: 'WhatsApp'
    },
    {
      id: 3,
      nome: 'Pedro Oliveira',
      telefone: '+55 11 77777-6666',
      etiqueta: 'Vendas',
      ultimoContato: '1 hora atrás',
      status: 'encerrado',
      avatar: 'PO',
      origem: 'WhatsApp'
    },
    {
      id: 4,
      nome: 'Ana Costa',
      telefone: '+55 11 66666-5555',
      etiqueta: 'Técnico',
      ultimoContato: '2 horas atrás',
      status: 'online',
      avatar: 'AC',
      origem: 'WhatsApp'
    },
    {
      id: 5,
      nome: 'Carlos Ferreira',
      telefone: '+55 11 55555-4444',
      etiqueta: 'VIP',
      ultimoContato: '3 horas atrás',
      status: 'aguardando',
      avatar: 'CF',
      origem: 'WhatsApp'
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
    switch (etiqueta) {
      case 'VIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Suporte':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vendas':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Técnico':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    if (selectedFilter === 'todos') return true;
    if (selectedFilter === 'online') return cliente.status === 'online';
    if (selectedFilter === 'aguardando') return cliente.status === 'aguardando';
    if (selectedFilter === 'encerrado') return cliente.status === 'encerrado';
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

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
              
              {/* Filtros */}
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
                      <Button variant="ghost" size="sm">
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
        </div>
      </main>
    </div>
  );
};

export default Umbler;