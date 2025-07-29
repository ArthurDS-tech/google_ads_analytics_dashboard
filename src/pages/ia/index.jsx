import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const IA = () => {
  const [selectedTool, setSelectedTool] = useState('keyword-generator');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const aiTools = [
    {
      id: 'keyword-generator',
      name: 'Gerador de Palavras-chave',
      description: 'IA para descobrir palavras-chave relevantes e lucrativas',
      icon: 'Search',
      status: 'active',
      usage: '85%'
    },
    {
      id: 'ad-optimizer',
      name: 'Otimizador de Anúncios',
      description: 'Análise e sugestões automáticas para melhorar CTR',
      icon: 'TrendingUp',
      status: 'active',
      usage: '72%'
    },
    {
      id: 'bid-manager',
      name: 'Gerenciador de Lances',
      description: 'Ajuste automático de lances baseado em IA',
      icon: 'DollarSign',
      status: 'active',
      usage: '91%'
    },
    {
      id: 'audience-analyzer',
      name: 'Analisador de Audiência',
      description: 'Identificação de públicos-alvo usando machine learning',
      icon: 'Users',
      status: 'learning',
      usage: '45%'
    }
  ];

  const recentSuggestions = [
    {
      id: 1,
      type: 'keyword',
      title: 'Nova palavra-chave identificada',
      description: '"marketing digital agencia" - CPC baixo, volume alto',
      impact: 'high',
      status: 'pending'
    },
    {
      id: 2,
      type: 'bid',
      title: 'Ajuste de lance recomendado',
      description: 'Reduzir lance da campanha "Produto A" em 15%',
      impact: 'medium',
      status: 'applied'
    },
    {
      id: 3,
      type: 'ad',
      title: 'Variação de anúncio sugerida',
      description: 'Teste A/B para título com call-to-action mais forte',
      impact: 'high',
      status: 'testing'
    },
    {
      id: 4,
      type: 'audience',
      title: 'Novo segmento de audiência',
      description: 'Público interessado em automação encontrado',
      impact: 'medium',
      status: 'pending'
    }
  ];

  const aiMetrics = [
    {
      label: 'ROI Melhorado',
      value: '+34%',
      description: 'Comparado ao mês anterior',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      label: 'Custo Reduzido',
      value: '-18%',
      description: 'CPC médio otimizado',
      icon: 'TrendingDown',
      color: 'primary'
    },
    {
      label: 'CTR Aumentado',
      value: '+27%',
      description: 'Taxa de cliques melhorada',
      icon: 'MousePointer',
      color: 'accent'
    },
    {
      label: 'Conversões',
      value: '+41%',
      description: 'Aumento nas conversões',
      icon: 'Target',
      color: 'warning'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'applied':
        return 'bg-success text-success-foreground';
      case 'testing':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'applied':
        return 'Aplicado';
      case 'testing':
        return 'Testando';
      default:
        return 'Desconhecido';
    }
  };

  const getToolStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'learning':
        return 'text-warning';
      case 'inactive':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
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
              <h1 className="text-3xl font-bold text-foreground mb-2">IA Assistant</h1>
              <p className="text-muted-foreground">
                Inteligência artificial para otimização automática de campanhas Google Ads
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                <Icon name={isAnalyzing ? "Loader2" : "Brain"} size={16} className={`mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analisando...' : 'Análise IA'}
              </Button>
              
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Configurar IA
              </Button>
              
              <Button size="sm">
                <Icon name="Zap" size={16} className="mr-2" />
                Ativar Auto-Pilot
              </Button>
            </div>
          </div>

          {/* AI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {aiMetrics.map((metric, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${metric.color}/10`}>
                    <Icon name={metric.icon} size={24} className={`text-${metric.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* AI Tools */}
            <div className="xl:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Ferramentas de IA</h2>
                  <Button size="sm" variant="outline">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Nova Ferramenta
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiTools.map((tool) => (
                    <div 
                      key={tool.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTool === tool.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon name={tool.icon} size={20} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                        <div className={`text-xs font-medium ${getToolStatusColor(tool.status)}`}>
                          ●
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uso da IA</span>
                          <span className="text-foreground">{tool.usage}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: tool.usage }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button size="sm" variant={selectedTool === tool.id ? "default" : "ghost"}>
                          {selectedTool === tool.id ? "Configurar" : "Selecionar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent AI Suggestions */}
            <div className="xl:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Sugestões da IA</h2>
                  <Button variant="ghost" size="sm">
                    <Icon name="RefreshCw" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name={
                              suggestion.type === 'keyword' ? 'Hash' :
                              suggestion.type === 'bid' ? 'DollarSign' :
                              suggestion.type === 'ad' ? 'FileText' : 'Users'
                            } 
                            size={16} 
                            className="text-primary" 
                          />
                          <span className={`text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact === 'high' ? 'Alto' : suggestion.impact === 'medium' ? 'Médio' : 'Baixo'} Impacto
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                          {getStatusText(suggestion.status)}
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-foreground mb-1">{suggestion.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          {suggestion.status === 'pending' ? 'Aplicar' : 'Ver'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* AI Performance Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Performance da IA</h2>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Gráfico de Performance da IA</p>
                  <p className="text-xs text-muted-foreground mt-1">Dados em tempo real das otimizações</p>
                </div>
              </div>
            </div>

            {/* AI Learning Status */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Status do Aprendizado</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Análise de Palavras-chave</span>
                    <span className="text-foreground">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Otimização de Lances</span>
                    <span className="text-foreground">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Análise de Audiência</span>
                    <span className="text-foreground">65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Criação de Anúncios</span>
                    <span className="text-foreground">43%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Brain" size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">IA em Evolução</p>
                    <p className="text-xs text-muted-foreground">
                      Quanto mais dados, melhor a performance das sugestões
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Configuration Panel */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Configurações da IA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Auto-Pilot</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Aplicação automática de otimizações aprovadas
                </p>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Shield" size={24} className="text-success" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Limites de Segurança</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Defina limites para mudanças automáticas
                </p>
                <Button variant="outline" size="sm">Ajustar</Button>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Bell" size={24} className="text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Notificações</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Receba alertas sobre sugestões importantes
                </p>
                <Button variant="outline" size="sm">Personalizar</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IA;