import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativa',
          bgColor: 'bg-success',
          textColor: 'text-success-foreground',
          icon: 'Play',
          dotColor: 'bg-success'
        };
      case 'paused':
        return {
          label: 'Pausada',
          bgColor: 'bg-warning',
          textColor: 'text-warning-foreground',
          icon: 'Pause',
          dotColor: 'bg-warning'
        };
      case 'budget_limited':
        return {
          label: 'Limitada por Orçamento',
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          icon: 'AlertTriangle',
          dotColor: 'bg-error'
        };
      case 'ended':
        return {
          label: 'Finalizada',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'Square',
          dotColor: 'bg-muted-foreground'
        };
      default:
        return {
          label: 'Desconhecido',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'HelpCircle',
          dotColor: 'bg-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
      <Icon name={config.icon} size={14} />
      <span>{config.label}</span>
    </div>
  );
};

export default CampaignStatusBadge;