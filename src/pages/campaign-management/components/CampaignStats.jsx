import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignStats = ({ campaigns }) => {
  const calculateStats = () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const pausedCampaigns = campaigns.filter(c => c.status === 'paused').length;
    const budgetLimitedCampaigns = campaigns.filter(c => c.status === 'budget_limited').length;
    
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    
    const avgCTR = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length 
      : 0;
    
    const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const budgetUtilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      pausedCampaigns,
      budgetLimitedCampaigns,
      totalSpend,
      totalBudget,
      totalClicks,
      totalConversions,
      avgCTR,
      avgCPC,
      conversionRate,
      budgetUtilization
    };
  };

  const stats = calculateStats();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const StatCard = ({ title, value, icon, color = "text-foreground", bgColor = "bg-card" }) => (
    <div className={`${bgColor} border border-border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-muted ${color}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total de Campanhas"
        value={stats.totalCampaigns}
        icon="Target"
        color="text-primary"
      />
      
      <StatCard
        title="Campanhas Ativas"
        value={stats.activeCampaigns}
        icon="Play"
        color="text-success"
      />
      
      <StatCard
        title="Gasto Total"
        value={formatCurrency(stats.totalSpend)}
        icon="DollarSign"
        color="text-warning"
      />
      
      <StatCard
        title="Total de Cliques"
        value={formatNumber(stats.totalClicks)}
        icon="MousePointer"
        color="text-accent"
      />
      
      <StatCard
        title="Campanhas Pausadas"
        value={stats.pausedCampaigns}
        icon="Pause"
        color="text-warning"
      />
      
      <StatCard
        title="Limitadas por Orçamento"
        value={stats.budgetLimitedCampaigns}
        icon="AlertTriangle"
        color="text-error"
      />
      
      <StatCard
        title="CTR Médio"
        value={formatPercentage(stats.avgCTR)}
        icon="TrendingUp"
        color="text-accent"
      />
      
      <StatCard
        title="Total de Conversões"
        value={stats.totalConversions}
        icon="Target"
        color="text-success"
      />
      
      <StatCard
        title="CPC Médio"
        value={formatCurrency(stats.avgCPC)}
        icon="DollarSign"
        color="text-primary"
      />
      
      <StatCard
        title="Taxa de Conversão"
        value={formatPercentage(stats.conversionRate)}
        icon="TrendingUp"
        color="text-success"
      />
      
      <StatCard
        title="Utilização do Orçamento"
        value={formatPercentage(stats.budgetUtilization)}
        icon="PieChart"
        color="text-warning"
      />
      
      <StatCard
        title="Orçamento Total"
        value={formatCurrency(stats.totalBudget)}
        icon="Wallet"
        color="text-muted-foreground"
      />
    </div>
  );
};

export default CampaignStats;