import React from 'react';
import Icon from '../../../components/AppIcon';

const HourlyHeatmap = ({ data }) => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensityColor = (value) => {
    const intensity = Math.min(value / 100, 1);
    const opacity = Math.max(intensity, 0.1);
    return `rgba(37, 99, 235, ${opacity})`;
  };

  const getIntensityText = (value) => {
    if (value >= 80) return 'Alto';
    if (value >= 50) return 'Médio';
    if (value >= 20) return 'Baixo';
    return 'Muito Baixo';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Mapa de Calor - Performance por Hora</h3>
        <Icon name="Clock" size={20} className="text-muted-foreground" />
      </div>
      
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Baixa Performance</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(37, 99, 235, 0.3)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(37, 99, 235, 0.6)' }}></div>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(37, 99, 235, 1)' }}></div>
          </div>
          <span>Alta Performance</span>
        </div>
        
        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Hour Headers */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {hours.map((hour) => (
                <div key={hour} className="w-8 text-xs text-center text-muted-foreground">
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
            
            {/* Day Rows */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-12 text-xs text-muted-foreground text-right pr-2">
                  {day}
                </div>
                {hours.map((hour) => {
                  const cellData = data.find(d => d.day === dayIndex && d.hour === hour);
                  const value = cellData ? cellData.performance : 0;
                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="w-8 h-6 mx-px rounded cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200"
                      style={{ backgroundColor: getIntensityColor(value) }}
                      title={`${day} ${hour}:00 - ${getIntensityText(value)} (${value}%)`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">14:00</p>
            <p className="text-xs text-muted-foreground">Melhor Hora</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">Ter</p>
            <p className="text-xs text-muted-foreground">Melhor Dia</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">85%</p>
            <p className="text-xs text-muted-foreground">Pico Performance</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">23%</p>
            <p className="text-xs text-muted-foreground">Performance Mínima</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyHeatmap;