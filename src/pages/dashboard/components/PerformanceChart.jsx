import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';


const PerformanceChart = () => {
  const [selectedMetric, setSelectedMetric] = useState('impressions');
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');

  const chartData = [
    { date: '11/07', impressions: 12500, clicks: 850, cost: 2340, conversions: 45 },
    { date: '12/07', impressions: 13200, clicks: 920, cost: 2580, conversions: 52 },
    { date: '13/07', impressions: 11800, clicks: 780, cost: 2120, conversions: 38 },
    { date: '14/07', impressions: 14500, clicks: 1050, cost: 2890, conversions: 61 },
    { date: '15/07', impressions: 13800, clicks: 980, cost: 2650, conversions: 55 },
    { date: '16/07', impressions: 15200, clicks: 1120, cost: 3100, conversions: 68 },
    { date: '17/07', impressions: 14900, clicks: 1080, cost: 2980, conversions: 64 },
    { date: '18/07', impressions: 16100, clicks: 1200, cost: 3250, conversions: 72 }
  ];

  const metrics = [
    { key: 'impressions', label: 'Impressões', color: '#2563EB' },
    { key: 'clicks', label: 'Cliques', color: '#10B981' },
    { key: 'cost', label: 'Custo (R$)', color: '#D97706' },
    { key: 'conversions', label: 'Conversões', color: '#DC2626' }
  ];

  const timeRanges = [
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: '90d', label: '90 dias' }
  ];

  const formatTooltipValue = (value, name) => {
    if (name === 'cost') {
      return [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Custo'];
    }
    return [value.toLocaleString('pt-BR'), metrics.find(m => m.key === name)?.label || name];
  };

  const currentMetric = metrics.find(m => m.key === selectedMetric);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Performance das Campanhas</h3>
          <p className="text-sm text-muted-foreground">Acompanhe o desempenho ao longo do tempo</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  timeRange === range.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                chartType === 'line' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="TrendingUp" size={16} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                chartType === 'bar' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="BarChart3" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border ${
              selectedMetric === metric.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: metric.color }}
              ></div>
              <span>{metric.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => 
                  selectedMetric === 'cost' 
                    ? `R$ ${(value / 1000).toFixed(1)}k`
                    : value > 1000 
                      ? `${(value / 1000).toFixed(1)}k`
                      : value
                }
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentMetric?.color}
                strokeWidth={3}
                dot={{ fill: currentMetric?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: currentMetric?.color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => 
                  selectedMetric === 'cost' 
                    ? `R$ ${(value / 1000).toFixed(1)}k`
                    : value > 1000 
                      ? `${(value / 1000).toFixed(1)}k`
                      : value
                }
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey={selectedMetric}
                fill={currentMetric?.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;