import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const DevicePerformance = ({ data }) => {
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

  const formatTooltipValue = (value, name) => {
    if (name === 'cost') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return `${value}%`;
  };

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return 'Monitor';
      case 'mobile':
        return 'Smartphone';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Device';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Performance por Dispositivo</h3>
        <Icon name="Devices" size={20} className="text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="percentage"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Device Stats */}
        <div className="space-y-4">
          {data.map((device, index) => (
            <div key={device.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <Icon name={getDeviceIcon(device.name)} size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{device.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{device.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(device.cost)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevicePerformance;