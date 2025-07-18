import React from 'react';
import Icon from '../../../components/AppIcon';

const GeographicMap = ({ data }) => {
  const getPerformanceColor = (performance) => {
    if (performance >= 80) return 'bg-success';
    if (performance >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getPerformanceText = (performance) => {
    if (performance >= 80) return 'Excelente';
    if (performance >= 60) return 'Bom';
    return 'Precisa Melhorar';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Performance Geográfica</h3>
        <Icon name="Map" size={20} className="text-muted-foreground" />
      </div>
      
      <div className="space-y-4">
        {/* Map Placeholder */}
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-6">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Brazil Performance Map"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=-14.2350,-51.9253&z=4&output=embed"
            className="rounded-lg"
          />
        </div>
        
        {/* Regional Performance List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground mb-3">Performance por Região</h4>
          {data.map((region) => (
            <div key={region.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getPerformanceColor(region.performance)}`}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{region.name}</p>
                  <p className="text-xs text-muted-foreground">{region.impressions.toLocaleString('pt-BR')} impressões</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(region.cost)}
                </p>
                <p className="text-xs text-muted-foreground">{getPerformanceText(region.performance)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;