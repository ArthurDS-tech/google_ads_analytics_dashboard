import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignStatusWidget = () => {
  const campaignStats = [
    { status: 'Ativas', count: 24, color: 'success', icon: 'Play' },
    { status: 'Pausadas', count: 8, color: 'warning', icon: 'Pause' },
    { status: 'Rascunho', count: 3, color: 'secondary', icon: 'FileText' },
    { status: 'Encerradas', count: 12, color: 'error', icon: 'Square' }
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: "Campanha Black Friday 2024",
      status: "active",
      budget: 5000,
      spent: 3250,
      performance: "good"
    },
    {
      id: 2,
      name: "Produtos Eletrônicos - Verão",
      status: "active",
      budget: 3000,
      spent: 2890,
      performance: "excellent"
    },
    {
      id: 3,
      name: "Remarketing - Carrinho Abandonado",
      status: "paused",
      budget: 1500,
      spent: 890,
      performance: "average"
    },
    {
      id: 4,
      name: "Lançamento Produto Novo",
      status: "active",
      budget: 4000,
      spent: 1200,
      performance: "good"
    }
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      active: 'text-success',
      paused: 'text-warning',
      draft: 'text-secondary',
      ended: 'text-error'
    };
    return statusMap[status] || 'text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      active: 'Play',
      paused: 'Pause',
      draft: 'FileText',
      ended: 'Square'
    };
    return iconMap[status] || 'Circle';
  };

  const getPerformanceColor = (performance) => {
    const performanceMap = {
      excellent: 'text-success',
      good: 'text-accent',
      average: 'text-warning',
      poor: 'text-error'
    };
    return performanceMap[performance] || 'text-muted-foreground';
  };

  const getPerformanceLabel = (performance) => {
    const labelMap = {
      excellent: 'Excelente',
      good: 'Bom',
      average: 'Médio',
      poor: 'Ruim'
    };
    return labelMap[performance] || 'N/A';
  };

  const handleViewAllCampaigns = () => {
    window.location.href = '/campaign-management';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Status das Campanhas</h3>
          <p className="text-sm text-muted-foreground">Visão geral do portfólio</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewAllCampaigns}>
          Ver Todas
        </Button>
      </div>

      {/* Campaign Status Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {campaignStats.map((stat) => (
          <div key={stat.status} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color} text-${stat.color}-foreground`}>
              <Icon name={stat.icon} size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.status}</p>
              <p className="text-xl font-bold text-foreground">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Campaigns */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4">Campanhas Recentes</h4>
        <div className="space-y-3">
          {recentCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status).replace('text-', 'bg-')}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{campaign.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      R$ {campaign.spent.toLocaleString('pt-BR')} / R$ {campaign.budget.toLocaleString('pt-BR')}
                    </span>
                    <span className={`text-xs font-medium ${getPerformanceColor(campaign.performance)}`}>
                      {getPerformanceLabel(campaign.performance)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {Math.round((campaign.spent / campaign.budget) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignStatusWidget;