import React from 'react';
import Icon from '../AppIcon';

const StatsCard = ({ 
  label, 
  value, 
  icon, 
  color = 'primary', 
  change, 
  changeType = 'neutral',
  loading = false,
  trend = null,
  subtitle = null 
}) => {
  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-destructive/10 text-destructive',
      accent: 'bg-accent/10 text-accent',
      muted: 'bg-muted/10 text-muted-foreground'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      case 'neutral':
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      case 'neutral':
      default:
        return 'Minus';
    }
  };

  const formatValue = (value) => {
    if (loading) return '---';
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading && (
              <Icon name="Loader2" size={12} className="animate-spin text-muted-foreground" />
            )}
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-foreground">
              {formatValue(value)}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Mudança e trend */}
          <div className="flex items-center space-x-3 mt-3">
            {change && (
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getChangeIcon(changeType)} 
                  size={14} 
                  className={getChangeColor(changeType)} 
                />
                <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
                  {change}
                </span>
              </div>
            )}
            
            {trend && (
              <span className="text-xs text-muted-foreground">
                {trend}
              </span>
            )}
            
            {!trend && change && (
              <span className="text-xs text-muted-foreground">
                vs. período anterior
              </span>
            )}
          </div>
        </div>
        
        {/* Ícone */}
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      
      {/* Barra de progresso opcional */}
      {trend && typeof value === 'number' && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                changeType === 'positive' ? 'bg-success' :
                changeType === 'negative' ? 'bg-destructive' : 
                'bg-primary'
              }`}
              style={{ 
                width: `${Math.min(Math.max((value / 100) * 100, 0), 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;