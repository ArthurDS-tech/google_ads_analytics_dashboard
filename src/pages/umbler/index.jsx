import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Umbler = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isManaging, setIsManaging] = useState(false);

  const hostingPlans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 19,90',
      storage: '5 GB',
      bandwidth: '100 GB',
      domains: '1',
      databases: '3',
      email: '10',
      ssl: true,
      backup: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 39,90',
      storage: '20 GB',
      bandwidth: 'Ilimitado',
      domains: '5',
      databases: '20',
      email: '50',
      ssl: true,
      backup: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 'R$ 79,90',
      storage: '50 GB',
      bandwidth: 'Ilimitado',
      domains: 'Ilimitado',
      databases: 'Ilimitado',
      email: 'Ilimitado',
      ssl: true,
      backup: true
    }
  ];

  const websites = [
    {
      id: 1,
      domain: 'meusite.com.br',
      status: 'online',
      plan: 'Premium',
      visitors: '2.3k',
      bandwidth: '45%',
      lastBackup: '2 horas atrás'
    },
    {
      id: 2,
      domain: 'loja.exemplo.com',
      status: 'online',
      plan: 'Business',
      visitors: '5.7k',
      bandwidth: '67%',
      lastBackup: '1 hora atrás'
    },
    {
      id: 3,
      domain: 'blog.teste.net',
      status: 'maintenance',
      plan: 'Básico',
      visitors: '890',
      bandwidth: '23%',
      lastBackup: '4 horas atrás'
    }
  ];

  const quickStats = [
    {
      label: 'Sites Ativos',
      value: '3',
      icon: 'Globe',
      color: 'primary'
    },
    {
      label: 'Uptime',
      value: '99.9%',
      icon: 'Activity',
      color: 'success'
    },
    {
      label: 'Visitantes Hoje',
      value: '8.9k',
      icon: 'Users',
      color: 'accent'
    },
    {
      label: 'Armazenamento',
      value: '65%',
      icon: 'HardDrive',
      color: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success text-success-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      case 'offline':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'maintenance':
        return 'Manutenção';
      case 'offline':
        return 'Offline';
      default:
        return 'Desconhecido';
    }
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Umbler Dashboard</h1>
              <p className="text-muted-foreground">
                Gerencie seus sites e planos de hospedagem
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm">
                <Icon name="Plus" size={16} className="mr-2" />
                Novo Site
              </Button>
              
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Configurações
              </Button>
              
              <Button 
                variant={isManaging ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setIsManaging(!isManaging)}
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Gerenciar
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                    <Icon name={stat.icon} size={24} className={`text-${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Websites Management */}
            <div className="xl:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Meus Sites</h2>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Adicionar Site
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {websites.map((website) => (
                    <div key={website.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon name="Globe" size={20} className="text-primary" />
                          <div>
                            <h3 className="font-medium text-foreground">{website.domain}</h3>
                            <p className="text-sm text-muted-foreground">Plano {website.plan}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(website.status)}`}>
                          {getStatusText(website.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Visitantes</p>
                          <p className="font-medium text-foreground">{website.visitors}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Banda Usada</p>
                          <p className="font-medium text-foreground">{website.bandwidth}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Último Backup</p>
                          <p className="font-medium text-foreground">{website.lastBackup}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="ghost" size="sm">
                          <Icon name="ExternalLink" size={14} className="mr-1" />
                          Visitar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icon name="Settings" size={14} className="mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hosting Plans */}
            <div className="xl:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Planos</h2>
                  <Button variant="ghost" size="sm">
                    <Icon name="RefreshCw" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {hostingPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPlan === plan.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">{plan.name}</h3>
                        <span className="text-lg font-bold text-primary">{plan.price}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Armazenamento</span>
                          <span className="text-foreground">{plan.storage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transferência</span>
                          <span className="text-foreground">{plan.bandwidth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Domínios</span>
                          <span className="text-foreground">{plan.domains}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bancos de Dados</span>
                          <span className="text-foreground">{plan.databases}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                        <div className="flex space-x-2">
                          {plan.ssl && <Icon name="Shield" size={16} className="text-success" />}
                          {plan.backup && <Icon name="Database" size={16} className="text-primary" />}
                        </div>
                        <Button size="sm" variant={selectedPlan === plan.id ? "default" : "outline"}>
                          {selectedPlan === plan.id ? "Atual" : "Contratar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Support and Resources */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Suporte e Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="HelpCircle" size={24} className="text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Central de Ajuda</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Encontre respostas para suas dúvidas em nossa base de conhecimento
                </p>
                <Button variant="outline" size="sm">Acessar</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="MessageCircle" size={24} className="text-success" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Chat ao Vivo</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Converse com nosso suporte especializado
                </p>
                <Button variant="outline" size="sm">Iniciar Chat</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="BookOpen" size={24} className="text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Documentação</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Guias técnicos e tutoriais completos
                </p>
                <Button variant="outline" size="sm">Ver Docs</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Umbler;