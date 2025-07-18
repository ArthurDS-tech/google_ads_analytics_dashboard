import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import KPICard from './components/KPICard';
import PerformanceChart from './components/PerformanceChart';
import CampaignStatusWidget from './components/CampaignStatusWidget';
import AlertsPanel from './components/AlertsPanel';
import QuickActions from './components/QuickActions';
import AccountSelector from './components/AccountSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [dateRange, setDateRange] = useState('7d');
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const kpiData = [
    {
      title: 'Gasto Total',
      value: 'R$ 28.450,00',
      change: '+12,5%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      title: 'Impressões',
      value: '2.847.392',
      change: '+8,3%',
      changeType: 'positive',
      icon: 'Eye',
      color: 'accent'
    },
    {
      title: 'Cliques',
      value: '89.234',
      change: '+15,7%',
      changeType: 'positive',
      icon: 'MousePointer',
      color: 'success'
    },
    {
      title: 'CTR',
      value: '3,13%',
      change: '+0,8%',
      changeType: 'positive',
      icon: 'Target',
      color: 'warning'
    },
    {
      title: 'ROAS',
      value: '4,2x',
      change: '-2,1%',
      changeType: 'negative',
      icon: 'TrendingUp',
      color: 'primary'
    }
  ];

  const dateRanges = [
    { key: '7d', label: 'Últimos 7 dias' },
    { key: '30d', label: 'Últimos 30 dias' },
    { key: '90d', label: 'Últimos 90 dias' },
    { key: 'custom', label: 'Personalizado' }
  ];

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, this would trigger data refresh
    console.log('Date range changed to:', range);
  };

  const handleRefreshData = () => {
    // In a real app, this would trigger a data refresh
    console.log('Refreshing dashboard data...');
  };

  const handleExportData = () => {
    // In a real app, this would trigger data export
    console.log('Exporting dashboard data...');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Visão geral das suas campanhas Google Ads • {getCurrentDate()}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Range Selector */}
              <div className="flex bg-muted rounded-lg p-1">
                {dateRanges.map((range) => (
                  <button
                    key={range.key}
                    onClick={() => handleDateRangeChange(range.key)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      dateRange === range.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Atualizar
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Icon name="Download" size={16} className="mr-2" />
                Exportar
              </Button>
              
              <Button 
                variant={isCustomizing ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setIsCustomizing(!isCustomizing)}
              >
                <Icon name="Settings" size={16} className="mr-2" />
                Personalizar
              </Button>
            </div>
          </div>

          {/* Customization Notice */}
          {isCustomizing && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-3">
                <Icon name="Info" size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Modo de Personalização Ativo</p>
                  <p className="text-xs text-muted-foreground">
                    Arraste e solte os widgets para reorganizar o dashboard conforme sua preferência.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
            {/* Performance Chart - Takes up 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <PerformanceChart />
            </div>
            
            {/* Account Selector - Takes up 1 column on xl screens */}
            <div className="xl:col-span-1">
              <AccountSelector />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
            {/* Campaign Status Widget */}
            <div className="lg:col-span-1">
              <CampaignStatusWidget />
            </div>
            
            {/* Alerts Panel */}
            <div className="lg:col-span-1">
              <AlertsPanel />
            </div>
            
            {/* Quick Actions */}
            <div className="lg:col-span-2 xl:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Footer Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Palavras-chave Ativas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-sm text-muted-foreground">Grupos de Anúncios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">R$ 8,45</p>
                <p className="text-sm text-muted-foreground">CPC Médio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">2,8%</p>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">R$ 125,30</p>
                <p className="text-sm text-muted-foreground">Custo por Conversão</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">89%</p>
                <p className="text-sm text-muted-foreground">Qualidade do Anúncio</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;