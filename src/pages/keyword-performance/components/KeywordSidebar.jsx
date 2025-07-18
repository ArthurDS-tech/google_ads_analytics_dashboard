import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const KeywordSidebar = () => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [newKeyword, setNewKeyword] = useState('');

  const keywordSuggestions = [
    {
      keyword: "marketing digital brasil",
      searchVolume: 8900,
      competition: "Média",
      suggestedBid: 2.45,
      relevance: 95
    },
    {
      keyword: "agência marketing online",
      searchVolume: 6700,
      competition: "Alta",
      suggestedBid: 3.12,
      relevance: 88
    },
    {
      keyword: "consultoria google ads",
      searchVolume: 4200,
      competition: "Baixa",
      suggestedBid: 1.89,
      relevance: 92
    },
    {
      keyword: "otimização seo sem",
      searchVolume: 3800,
      competition: "Média",
      suggestedBid: 2.67,
      relevance: 85
    },
    {
      keyword: "campanhas ppc eficazes",
      searchVolume: 2900,
      competition: "Alta",
      suggestedBid: 4.23,
      relevance: 90
    }
  ];

  const negativeKeywords = [
    { keyword: "grátis", reason: "Baixa intenção de compra" },
    { keyword: "free", reason: "Baixa intenção de compra" },
    { keyword: "barato", reason: "Público não qualificado" },
    { keyword: "curso", reason: "Fora do escopo" },
    { keyword: "tutorial", reason: "Conteúdo educacional" }
  ];

  const searchTerms = [
    {
      term: "melhor agência marketing digital",
      impressions: 1250,
      clicks: 45,
      ctr: 3.6,
      status: "new"
    },
    {
      term: "marketing digital para pequenas empresas",
      impressions: 890,
      clicks: 32,
      ctr: 3.6,
      status: "potential"
    },
    {
      term: "como fazer marketing digital",
      impressions: 2100,
      clicks: 12,
      ctr: 0.57,
      status: "negative"
    }
  ];

  const tabs = [
    { id: 'suggestions', label: 'Sugestões', icon: 'Lightbulb' },
    { id: 'negative', label: 'Negativas', icon: 'X' },
    { id: 'search-terms', label: 'Termos', icon: 'Search' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getCompetitionColor = (competition) => {
    switch (competition) {
      case 'Alta': return 'text-error';
      case 'Média': return 'text-warning';
      case 'Baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSearchTermStatus = (status) => {
    switch (status) {
      case 'new': return { color: 'bg-primary/10 text-primary', label: 'Novo' };
      case 'potential': return { color: 'bg-success/10 text-success', label: 'Potencial' };
      case 'negative': return { color: 'bg-error/10 text-error', label: 'Negativo' };
      default: return { color: 'bg-muted text-muted-foreground', label: status };
    }
  };

  return (
    <div className="w-full lg:w-80 bg-card border border-border rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 h-96 overflow-y-auto">
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Sugestões de Palavras-chave</h3>
              <Button variant="ghost" size="sm" iconName="RefreshCw">
                <span className="sr-only">Atualizar</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {keywordSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">{suggestion.keyword}</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-xs text-muted-foreground">{suggestion.relevance}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Volume:</span>
                      <span className="font-medium">{formatNumber(suggestion.searchVolume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Concorrência:</span>
                      <span className={`font-medium ${getCompetitionColor(suggestion.competition)}`}>
                        {suggestion.competition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lance sugerido:</span>
                      <span className="font-medium">{formatCurrency(suggestion.suggestedBid)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      Adicionar
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal">
                      <span className="sr-only">Mais opções</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'negative' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Palavras-chave Negativas</h3>
              <Button variant="ghost" size="sm" iconName="Plus">
                <span className="sr-only">Adicionar</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Adicionar palavra negativa..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
              <Button variant="outline" size="sm" className="w-full" iconName="Plus" iconPosition="left">
                Adicionar à Lista
              </Button>
            </div>
            
            <div className="space-y-2">
              {negativeKeywords.map((negative, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-border rounded-lg">
                  <div>
                    <span className="font-medium text-foreground text-sm">{negative.keyword}</span>
                    <p className="text-xs text-muted-foreground">{negative.reason}</p>
                  </div>
                  <Button variant="ghost" size="sm" iconName="Trash2" className="text-error">
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'search-terms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Termos de Pesquisa</h3>
              <Button variant="ghost" size="sm" iconName="Filter">
                <span className="sr-only">Filtrar</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {searchTerms.map((term, index) => {
                const statusInfo = getSearchTermStatus(term.status);
                return (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm">{term.term}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                      <div className="text-center">
                        <span className="block font-medium text-foreground">{formatNumber(term.impressions)}</span>
                        <span>Impressões</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-medium text-foreground">{term.clicks}</span>
                        <span>Cliques</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-medium text-foreground">{term.ctr}%</span>
                        <span>CTR</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Adicionar
                      </Button>
                      <Button variant="ghost" size="sm" iconName="X" className="text-error">
                        <span className="sr-only">Negar</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordSidebar;