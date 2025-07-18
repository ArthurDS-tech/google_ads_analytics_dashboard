import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportPreview = ({ report, config, onEdit, onGenerate, onClose }) => {
  const mockChartData = {
    impressions: [
      { date: '01/01', value: 15420 },
      { date: '02/01', value: 18350 },
      { date: '03/01', value: 22100 },
      { date: '04/01', value: 19800 },
      { date: '05/01', value: 25600 }
    ],
    clicks: [
      { date: '01/01', value: 892 },
      { date: '02/01', value: 1045 },
      { date: '03/01', value: 1234 },
      { date: '04/01', value: 1156 },
      { date: '05/01', value: 1398 }
    ]
  };

  const mockMetrics = {
    totalImpressions: 101270,
    totalClicks: 5725,
    ctr: 5.65,
    avgCpc: 2.45,
    totalCost: 14026.25,
    conversions: 234,
    conversionRate: 4.09,
    roas: 4.2
  };

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

  if (!report) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-border">
        <div className="text-center">
          <Icon name="Eye" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Prévia do Relatório</h3>
          <p className="text-muted-foreground">Selecione um relatório para visualizar a prévia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Prévia do Relatório</h2>
          <p className="text-sm text-muted-foreground">{report.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onEdit}>
            <Icon name="Edit" size={16} className="mr-2" />
            Editar
          </Button>
          <Button onClick={onGenerate}>
            <Icon name="Download" size={16} className="mr-2" />
            Gerar
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Report Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {config?.reportTitle || 'Relatório de Performance - Google Ads'}
              </h1>
              <p className="text-muted-foreground">
                Período: {config?.dateRange === 'last-30-days' ? 'Últimos 30 dias' : 'Período personalizado'}
              </p>
            </div>
            {config?.brandingEnabled && config?.logoUrl && (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Icon name="Building" size={24} className="text-muted-foreground" />
              </div>
            )}
          </div>
          
          {config?.brandingEnabled && config?.companyName && (
            <p className="text-sm text-muted-foreground">{config.companyName}</p>
          )}
        </div>

        {/* Executive Summary */}
        {config?.includeExecutiveSummary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Resumo Executivo</h2>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-muted-foreground">
                Durante o período analisado, as campanhas apresentaram performance sólida com {formatNumber(mockMetrics.totalImpressions)} impressões 
                e {formatNumber(mockMetrics.totalClicks)} cliques, resultando em uma taxa de cliques de {formatPercentage(mockMetrics.ctr)}. 
                O investimento total de {formatCurrency(mockMetrics.totalCost)} gerou {mockMetrics.conversions} conversões, 
                com ROAS de {mockMetrics.roas}x.
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Métricas Principais</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Eye" size={20} className="text-primary" />
                <span className="text-xs text-success">+12.5%</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(mockMetrics.totalImpressions)}</p>
              <p className="text-sm text-muted-foreground">Impressões</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="MousePointer" size={20} className="text-primary" />
                <span className="text-xs text-success">+8.3%</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(mockMetrics.totalClicks)}</p>
              <p className="text-sm text-muted-foreground">Cliques</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Target" size={20} className="text-primary" />
                <span className="text-xs text-success">+15.2%</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatPercentage(mockMetrics.ctr)}</p>
              <p className="text-sm text-muted-foreground">CTR</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon name="DollarSign" size={20} className="text-primary" />
                <span className="text-xs text-error">-3.1%</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(mockMetrics.avgCpc)}</p>
              <p className="text-sm text-muted-foreground">CPC Médio</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {config?.includeCharts && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Gráficos de Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">Impressões ao Longo do Tempo</h3>
                <div className="h-48 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="BarChart3" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Gráfico de Impressões</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">Cliques ao Longo do Tempo</h3>
                <div className="h-48 bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="TrendingUp" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Gráfico de Cliques</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tables */}
        {config?.includeTables && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Tabelas Detalhadas</h2>
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-foreground">Campanha</th>
                      <th className="text-right p-3 font-medium text-foreground">Impressões</th>
                      <th className="text-right p-3 font-medium text-foreground">Cliques</th>
                      <th className="text-right p-3 font-medium text-foreground">CTR</th>
                      <th className="text-right p-3 font-medium text-foreground">CPC</th>
                      <th className="text-right p-3 font-medium text-foreground">Custo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-3 text-foreground">Campanha Black Friday 2024</td>
                      <td className="p-3 text-right text-foreground">{formatNumber(45230)}</td>
                      <td className="p-3 text-right text-foreground">{formatNumber(2156)}</td>
                      <td className="p-3 text-right text-foreground">{formatPercentage(4.77)}</td>
                      <td className="p-3 text-right text-foreground">{formatCurrency(2.85)}</td>
                      <td className="p-3 text-right text-foreground">{formatCurrency(6144.60)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 text-foreground">Campanha Natal 2024</td>
                      <td className="p-3 text-right text-foreground">{formatNumber(32180)}</td>
                      <td className="p-3 text-right text-foreground">{formatNumber(1834)}</td>
                      <td className="p-3 text-right text-foreground">{formatPercentage(5.70)}</td>
                      <td className="p-3 text-right text-foreground">{formatCurrency(2.12)}</td>
                      <td className="p-3 text-right text-foreground">{formatCurrency(3888.08)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-3 text-foreground">Campanha Verão 2025</td>
                      <td className="p-3 text-right text-foreground">{formatNumber(23860)}</td>
                      <td className="p-3 text-right text-foreground">{formatNumber(1735)}</td>
                      <td className="p-3 text-right text-foreground">{formatPercentage(7.27)}</td>
                      <td className="p-3 text-right text-foreground">{formatCurrency(2.28)}</td>
                      <td className="p-3 text-right text-foreground">{formatCurrency(3955.80)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>Relatório gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          {config?.brandingEnabled && config?.companyName && (
            <p className="mt-1">{config.companyName} - Google Ads Analytics Dashboard</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;