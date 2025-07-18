import React from 'react';
import Icon from '../../../components/AppIcon';

const KeywordSummaryCards = () => {
  const summaryData = [
    {
      title: "Total de Palavras-chave",
      value: "1.247",
      change: "+12%",
      changeType: "positive",
      icon: "Hash",
      description: "Palavras-chave ativas"
    },
    {
      title: "Pontuação de Qualidade Média",
      value: "7.2",
      change: "+0.3",
      changeType: "positive",
      icon: "Star",
      description: "Média geral"
    },
    {
      title: "Distribuição por Correspondência",
      value: "Exata: 45%",
      change: "Ampla: 35%",
      changeType: "neutral",
      icon: "Target",
      description: "Frase: 20%"
    },
    {
      title: "Gasto Total",
      value: "R$ 45.230",
      change: "+8.5%",
      changeType: "positive",
      icon: "DollarSign",
      description: "Últimos 30 dias"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryData.map((item, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              item.changeType === 'positive' ? 'bg-success/10' : 
              item.changeType === 'negative' ? 'bg-error/10' : 'bg-primary/10'
            }`}>
              <Icon 
                name={item.icon} 
                size={24} 
                color={
                  item.changeType === 'positive' ? 'var(--color-success)' : 
                  item.changeType === 'negative' ? 'var(--color-error)' : 'var(--color-primary)'
                }
              />
            </div>
            {item.changeType !== 'neutral' && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                item.changeType === 'positive' ?'bg-success/10 text-success' :'bg-error/10 text-error'
              }`}>
                <Icon 
                  name={item.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                />
                <span>{item.change}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            {item.changeType === 'neutral' && (
              <p className="text-xs text-muted-foreground">{item.change}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeywordSummaryCards;