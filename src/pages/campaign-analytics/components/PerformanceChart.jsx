import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PerformanceChart = ({ data, selectedMetrics, title }) => {
  const colors = {
    impressions: '#2563EB',
    clicks: '#10B981',
    conversions: '#F59E0B',
    cost: '#EF4444'
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'cost') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const formatYAxisValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-4">
          {selectedMetrics.map((metric) => (
            <div key={metric} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[metric] }}
              ></div>
              <span className="text-sm text-muted-foreground capitalize">
                {metric === 'impressions' ? 'Impressões' : 
                 metric === 'clicks' ? 'Cliques' :
                 metric === 'conversions' ? 'Conversões' : 'Custo'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickFormatter={formatYAxisValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={formatTooltipValue}
              labelStyle={{ color: '#1E293B' }}
            />
            <Legend />
            {selectedMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={colors[metric]}
                strokeWidth={2}
                dot={{ fill: colors[metric], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[metric], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;