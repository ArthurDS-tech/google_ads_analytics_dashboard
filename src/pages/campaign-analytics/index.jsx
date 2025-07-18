import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import MetricCard from './components/MetricCard';
import PerformanceChart from './components/PerformanceChart';
import GeographicMap from './components/GeographicMap';
import DevicePerformance from './components/DevicePerformance';
import HourlyHeatmap from './components/HourlyHeatmap';
import KeywordTable from './components/KeywordTable';
import FilterPanel from './components/FilterPanel';

const CampaignAnalytics = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(['impressions', 'clicks', 'conversions', 'cost']);
  const [dateRange, setDateRange] = useState('30');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for analytics
  const metricsData = [
    {
      title: 'Impressões Totais',
      value: 2847563,
      change: 12.5,
      changeType: 'positive',
      icon: 'Eye'
    },
    {
      title: 'Cliques Totais',
      value: 142378,
      change: 8.3,
      changeType: 'positive',
      icon: 'MousePointer'
    },
    {
      title: 'Conversões',
      value: 3247,
      change: -2.1,
      changeType: 'negative',
      icon: 'Target'
    },
    {
      title: 'Custo Total',
      value: 45678.90,
      change: 5.7,
      changeType: 'positive',
      icon: 'DollarSign',
      currency: true
    },
    {
      title: 'CTR Médio',
      value: 5.02,
      change: 0.8,
      changeType: 'positive',
      icon: 'TrendingUp'
    },
    {
      title: 'CPC Médio',
      value: 3.21,
      change: -1.2,
      changeType: 'negative',
      icon: 'Calculator',
      currency: true
    },
    {
      title: 'Taxa de Conversão',
      value: 2.28,
      change: 1.5,
      changeType: 'positive',
      icon: 'Percent'
    },
    {
      title: 'ROAS',
      value: 4.85,
      change: 3.2,
      changeType: 'positive',
      icon: 'TrendingUp'
    }
  ];

  const chartData = [
    { date: '01/07', impressions: 95000, clicks: 4750, conversions: 108, cost: 1520.50 },
    { date: '02/07', impressions: 102000, clicks: 5100, conversions: 115, cost: 1635.75 },
    { date: '03/07', impressions: 98000, clicks: 4900, conversions: 112, cost: 1575.25 },
    { date: '04/07', impressions: 110000, clicks: 5500, conversions: 125, cost: 1765.00 },
    { date: '05/07', impressions: 105000, clicks: 5250, conversions: 120, cost: 1687.50 },
    { date: '06/07', impressions: 115000, clicks: 5750, conversions: 131, cost: 1845.25 },
    { date: '07/07', impressions: 108000, clicks: 5400, conversions: 123, cost: 1734.00 },
    { date: '08/07', impressions: 120000, clicks: 6000, conversions: 137, cost: 1926.00 },
    { date: '09/07', impressions: 112000, clicks: 5600, conversions: 128, cost: 1798.40 },
    { date: '10/07', impressions: 118000, clicks: 5900, conversions: 135, cost: 1894.50 },
    { date: '11/07', impressions: 125000, clicks: 6250, conversions: 142, cost: 2006.25 },
    { date: '12/07', impressions: 122000, clicks: 6100, conversions: 139, cost: 1958.10 },
    { date: '13/07', impressions: 128000, clicks: 6400, conversions: 146, cost: 2054.40 },
    { date: '14/07', impressions: 130000, clicks: 6500, conversions: 148, cost: 2087.50 },
    { date: '15/07', impressions: 135000, clicks: 6750, conversions: 154, cost: 2166.75 },
    { date: '16/07', impressions: 132000, clicks: 6600, conversions: 151, cost: 2118.60 },
    { date: '17/07', impressions: 140000, clicks: 7000, conversions: 160, cost: 2247.00 },
    { date: '18/07', impressions: 138000, clicks: 6900, conversions: 157, cost: 2215.70 }
  ];

  const geographicData = [
    { id: 1, name: 'São Paulo', impressions: 850000, cost: 12500.75, performance: 85 },
    { id: 2, name: 'Rio de Janeiro', impressions: 620000, cost: 9200.50, performance: 78 },
    { id: 3, name: 'Minas Gerais', impressions: 480000, cost: 7100.25, performance: 72 },
    { id: 4, name: 'Rio Grande do Sul', impressions: 350000, cost: 5200.80, performance: 68 },
    { id: 5, name: 'Paraná', impressions: 320000, cost: 4750.60, performance: 75 },
    { id: 6, name: 'Bahia', impressions: 280000, cost: 4150.40, performance: 65 }
  ];

  const deviceData = [
    { name: 'Desktop', percentage: 45, cost: 20555.25 },
    { name: 'Mobile', percentage: 42, cost: 19184.58 },
    { name: 'Tablet', percentage: 13, cost: 5939.07 }
  ];

  const heatmapData = [
    { day: 0, hour: 8, performance: 45 }, { day: 0, hour: 9, performance: 52 }, { day: 0, hour: 10, performance: 68 },
    { day: 0, hour: 11, performance: 75 }, { day: 0, hour: 12, performance: 62 }, { day: 0, hour: 13, performance: 58 },
    { day: 0, hour: 14, performance: 72 }, { day: 0, hour: 15, performance: 78 }, { day: 0, hour: 16, performance: 65 },
    { day: 0, hour: 17, performance: 55 }, { day: 0, hour: 18, performance: 48 }, { day: 0, hour: 19, performance: 42 },
    { day: 0, hour: 20, performance: 38 }, { day: 0, hour: 21, performance: 35 },
    
    { day: 1, hour: 8, performance: 65 }, { day: 1, hour: 9, performance: 72 }, { day: 1, hour: 10, performance: 85 },
    { day: 1, hour: 11, performance: 88 }, { day: 1, hour: 12, performance: 82 }, { day: 1, hour: 13, performance: 78 },
    { day: 1, hour: 14, performance: 92 }, { day: 1, hour: 15, performance: 85 }, { day: 1, hour: 16, performance: 75 },
    { day: 1, hour: 17, performance: 68 }, { day: 1, hour: 18, performance: 58 }, { day: 1, hour: 19, performance: 52 },
    { day: 1, hour: 20, performance: 45 }, { day: 1, hour: 21, performance: 42 },
    
    { day: 2, hour: 8, performance: 68 }, { day: 2, hour: 9, performance: 75 }, { day: 2, hour: 10, performance: 88 },
    { day: 2, hour: 11, performance: 92 }, { day: 2, hour: 12, performance: 85 }, { day: 2, hour: 13, performance: 82 },
    { day: 2, hour: 14, performance: 95 }, { day: 2, hour: 15, performance: 88 }, { day: 2, hour: 16, performance: 78 },
    { day: 2, hour: 17, performance: 72 }, { day: 2, hour: 18, performance: 62 }, { day: 2, hour: 19, performance: 55 },
    { day: 2, hour: 20, performance: 48 }, { day: 2, hour: 21, performance: 45 },
    
    { day: 3, hour: 8, performance: 70 }, { day: 3, hour: 9, performance: 78 }, { day: 3, hour: 10, performance: 85 },
    { day: 3, hour: 11, performance: 88 }, { day: 3, hour: 12, performance: 82 }, { day: 3, hour: 13, performance: 78 },
    { day: 3, hour: 14, performance: 90 }, { day: 3, hour: 15, performance: 85 }, { day: 3, hour: 16, performance: 75 },
    { day: 3, hour: 17, performance: 68 }, { day: 3, hour: 18, performance: 58 }, { day: 3, hour: 19, performance: 52 },
    { day: 3, hour: 20, performance: 45 }, { day: 3, hour: 21, performance: 42 },
    
    { day: 4, hour: 8, performance: 72 }, { day: 4, hour: 9, performance: 80 }, { day: 4, hour: 10, performance: 88 },
    { day: 4, hour: 11, performance: 90 }, { day: 4, hour: 12, performance: 85 }, { day: 4, hour: 13, performance: 82 },
    { day: 4, hour: 14, performance: 92 }, { day: 4, hour: 15, performance: 88 }, { day: 4, hour: 16, performance: 78 },
    { day: 4, hour: 17, performance: 70 }, { day: 4, hour: 18, performance: 60 }, { day: 4, hour: 19, performance: 55 },
    { day: 4, hour: 20, performance: 48 }, { day: 4, hour: 21, performance: 45 },
    
    { day: 5, hour: 8, performance: 75 }, { day: 5, hour: 9, performance: 82 }, { day: 5, hour: 10, performance: 90 },
    { day: 5, hour: 11, performance: 92 }, { day: 5, hour: 12, performance: 88 }, { day: 5, hour: 13, performance: 85 },
    { day: 5, hour: 14, performance: 95 }, { day: 5, hour: 15, performance: 90 }, { day: 5, hour: 16, performance: 82 },
    { day: 5, hour: 17, performance: 75 }, { day: 5, hour: 18, performance: 65 }, { day: 5, hour: 19, performance: 58 },
    { day: 5, hour: 20, performance: 52 }, { day: 5, hour: 21, performance: 48 },
    
    { day: 6, hour: 8, performance: 50 }, { day: 6, hour: 9, performance: 58 }, { day: 6, hour: 10, performance: 72 },
    { day: 6, hour: 11, performance: 78 }, { day: 6, hour: 12, performance: 68 }, { day: 6, hour: 13, performance: 62 },
    { day: 6, hour: 14, performance: 75 }, { day: 6, hour: 15, performance: 82 }, { day: 6, hour: 16, performance: 70 },
    { day: 6, hour: 17, performance: 60 }, { day: 6, hour: 18, performance: 52 }, { day: 6, hour: 19, performance: 45 },
    { day: 6, hour: 20, performance: 42 }, { day: 6, hour: 21, performance: 38 }
  ];

  const keywordData = [
    { id: 1, keyword: 'marketing digital', impressions: 125000, clicks: 6250, ctr: 5.0, cost: 1875.00, conversions: 142, isNew: false },
    { id: 2, keyword: 'agência publicidade', impressions: 98000, clicks: 4900, ctr: 5.0, cost: 1470.00, conversions: 112, isNew: true },
    { id: 3, keyword: 'google ads', impressions: 156000, clicks: 7800, ctr: 5.0, cost: 2340.00, conversions: 178, isNew: false },
    { id: 4, keyword: 'ppc campanha', impressions: 87000, clicks: 4350, ctr: 5.0, cost: 1305.00, conversions: 99, isNew: false },
    { id: 5, keyword: 'anúncios online', impressions: 112000, clicks: 5600, ctr: 5.0, cost: 1680.00, conversions: 128, isNew: true },
    { id: 6, keyword: 'sem marketing', impressions: 76000, clicks: 3800, ctr: 5.0, cost: 1140.00, conversions: 87, isNew: false },
    { id: 7, keyword: 'publicidade digital', impressions: 134000, clicks: 6700, ctr: 5.0, cost: 2010.00, conversions: 153, isNew: false },
    { id: 8, keyword: 'campanha adwords', impressions: 92000, clicks: 4600, ctr: 5.0, cost: 1380.00, conversions: 105, isNew: true },
    { id: 9, keyword: 'otimização campanhas', impressions: 68000, clicks: 3400, ctr: 5.0, cost: 1020.00, conversions: 78, isNew: false },
    { id: 10, keyword: 'roi marketing', impressions: 145000, clicks: 7250, ctr: 5.0, cost: 2175.00, conversions: 165, isNew: false },
    { id: 11, keyword: 'conversão ads', impressions: 83000, clicks: 4150, ctr: 5.0, cost: 1245.00, conversions: 95, isNew: true },
    { id: 12, keyword: 'análise performance', impressions: 105000, clicks: 5250, ctr: 5.0, cost: 1575.00, conversions: 120, isNew: false },
    { id: 13, keyword: 'segmentação público', impressions: 78000, clicks: 3900, ctr: 5.0, cost: 1170.00, conversions: 89, isNew: false },
    { id: 14, keyword: 'landing page', impressions: 118000, clicks: 5900, ctr: 5.0, cost: 1770.00, conversions: 135, isNew: true },
    { id: 15, keyword: 'cpc otimizado', impressions: 95000, clicks: 4750, ctr: 5.0, cost: 1425.00, conversions: 108, isNew: false }
  ];

  const dateRangeOptions = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const metricOptions = [
    { value: 'impressions', label: 'Impressões' },
    { value: 'clicks', label: 'Cliques' },
    { value: 'conversions', label: 'Conversões' },
    { value: 'cost', label: 'Custo' }
  ];

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
  };

  const handleApplyFilters = (filters) => {
    console.log('Aplicando filtros:', filters);
    // Here you would typically update your data based on the filters
  };

  useEffect(() => {
    // Simulate data loading
    document.title = 'Análises de Campanhas - Google Ads Analytics';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Análises de Campanhas</h1>
              <p className="text-muted-foreground">
                Análise detalhada de performance e insights para otimização de campanhas
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Select
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                className="w-48"
              />
              <Button
                variant="outline"
                onClick={() => setIsFilterPanelOpen(true)}
                iconName="Filter"
              >
                Filtros
              </Button>
              <Button
                onClick={handleExport}
                loading={isExporting}
                iconName="Download"
              >
                Exportar
              </Button>
            </div>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                currency={metric.currency}
              />
            ))}
          </div>
          
          {/* Performance Chart */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Tendências de Performance</h2>
              <div className="flex items-center space-x-2">
                {metricOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedMetrics.includes(option.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMetricToggle(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <PerformanceChart
              data={chartData}
              selectedMetrics={selectedMetrics}
              title="Performance ao Longo do Tempo"
            />
          </div>
          
          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <GeographicMap data={geographicData} />
            <DevicePerformance data={deviceData} />
          </div>
          
          {/* Hourly Heatmap */}
          <div className="mb-8">
            <HourlyHeatmap data={heatmapData} />
          </div>
          
          {/* Keyword Performance Table */}
          <div className="mb-8">
            <KeywordTable data={keywordData} />
          </div>
          
          {/* Summary Insights */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Lightbulb" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Insights e Recomendações</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Oportunidade</span>
                </div>
                <p className="text-sm text-foreground">
                  Terças-feiras às 14h mostram o melhor desempenho. Considere aumentar lances neste horário.
                </p>
              </div>
              
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">Atenção</span>
                </div>
                <p className="text-sm text-foreground">
                  Performance em tablets está abaixo da média. Revise anúncios para este dispositivo.
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Recomendação</span>
                </div>
                <p className="text-sm text-foreground">
                  São Paulo e Rio de Janeiro têm alta performance. Considere expandir para regiões similares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default CampaignAnalytics;